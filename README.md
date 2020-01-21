### Status: this project and the `monolith` repo should be combined, taking the best parts from both, and then refining it. The goal is to end up with an ideal base for a monolithic application (frontend, backend, database, and that's about it) that all runs on docker-compose.

Note: this is a pretty cool new cloud service... https://render.com/. It might be easier than digital ocean for some things. Both of them are definitely better than AWS, which requires a team of DevOps thugs to do anything remotely useful.

### Goals for migrating to a more monolithic app

- swap nginx for traefik
- figure out if we need to keep the redis and mail services
- keep postgres, but figure out the migrations situation
- I think we can keep the frontend largely the same for dev/prod

---

### Prerequisites

- Install Docker.
- Install node, npm, yarn. This isn't absolutely essential, but if you don't then you'll have to always be running commands from inside containers which is not always convenient.
- An account with a cloud hosting platform. This project is currently using Digital Ocean, but it should be trivial to switch to another platform such as AWS.

### Hacking in the dev environment

To get up and running on your local machine, clone the project from Github and install all necessary dependencies. This will involve running `yarn` in the root folder. Then, `cd` into each docker service and run the appropriate command... currently we're just using `yarn`, but in the future some services could be using `composer` or something else. Now, you will need to create a `secrets.env` file in the root. Add something like this to the first line... `JWT_SECRET=n0tSUp3rseCRetYou$h0u1dCHanGem3`

Now you can boot up the application by running `docker-compose up -d`. You can then run `docker ps` to check that all containers started and are running.

Most containers make use of service volumes in development so that you can make edits on your host machine and Docker will automatically map your changes into the running container.

Upon initializing, the migrations container should automatically run any database migrations and apply them to the database container. The database container utilizes a named docker volume in order to persist data to the host machine. This way, if the database container fails, it can be spun back up and pick up where it left off. Speaking of failure, most containers are configured to be restarted in the event of a failure.

Some containers output useful information to the console, especially in development. However, it is the console inside the running container, not the console of your host machine. To access a container's console output, run `docker logs <container-name>`.

### Initial setup of the production server

Here, we will document how to setup your production server on Digital Ocean, but the process should be similar for other cloud providers.

First, create an account and in the API section generate an access token. Now, we will need to use `docker-machine` and the access token to install the Docker engine on Digital Ocean, which will create a new Droplet in the process.

```
docker-machine create \
--driver digitalocean \
--digitalocean-access-token=<access-token>
<machine-name>
```

And that's it! You can run `docker-machine ls` just to check that things went smoothly. We now have a running production server with Docker installed on it and ready to be deployed to.

### Deploying to production

The production server builds containers from images, rather than building them from directories on the host machine like in development. It will read from the existing images that are on the virtual machine, or else it will pull them from Docker Hub. With this in mind let's get started.

Using `docker-machine`, switch the Docker engine that the Docker daemon is interacting with to the remote production machine. All we need to do is set some environment variables, and we can do this in one fell swoop by running `eval $(docker-machine env <remote-vm-name>)`.

The next step is to (re)build our images with `docker-compose build`. The beauty of this is that Docker builds our images using our production ready code that resides on the computer we are working from, but since we configured Docker to communicate with the production server in the previous step, that is now where the built images reside. After successfully building the production images, let's go ahead and push them to Docker Hub with `docker-compose push`.

Now, we can deploy updates (or deploy for the very first time) with `docker-compose -f docker-compose.yml -f docker-compose.prod.yml up -d`.

By running `docker-compose up` with container instances already in service, Docker will automatically detect which images have changed and then tear down and rebuild the associated containers. This isn't exactly a blue/green or a rolling deployment, and there may be some minimal downtime, but it's pretty slick nonetheless. If there were any new database migrations, they will automatically be applied to the production database.

To understand the modified `docker-compose up` command we just ran, you will need an understanding of how multiple environments are handled using `docker-compose.yml` files, as recommended in the Docker documentation.

- `docker-compose.yml` - our base configuration, used by default by `docker-compose`
- `docker-compose.override.yml` - configuration specific to local development, and also used by default by `docker-compose`
- `docker-compose.prod.yml` - similar to `docker-compose.override.yml`, but used for production specific configuration. This file is not used by default by `docker-compose`, therefore we use the `-f` flag to specifically instruct Docker which configuration files to apply.
- You can of course have additional compose files as needed, for example to support a staging environment.

### Database migrations

When running `docker-compose up`, the migrations container will run all up migrations that have not already been applied when the container initializes. The migrations library, `node-migrate`, uses the `.migrate` file by default to track migrations, but it also supports using a custom store which is what we are doing with the `migration-store.js` file... storing our migrations status in the database itself.

This allows us to run `docker-compose down -v` to nuke the entire app, database volumes included, and we won't have to remember to delete the `.migrate` file.

### Environment variables and configuration

Common configuration settings are stored in `.env`. To make Docker aware of environment variables defined this way, we use the service level `env_file` key in our `docker-compose.yml` files, and we're even allowed to list multiple files. Sensitive information like passwords and secrets can be stored in `secrets.env`, which is ignored by version control. To set environment specific configuration, such as `NODE_ENV=production`, use the service level `environment` key inside of the appropriate `docker-compose.yml` file. To access environment variables inside of a Dockerfile, you can look at `docker-compose.override.yml` and `auth/Dockerfile` for an example.

The nginx service is using a template file and a bash script to generate the nginx configuration when the container starts. Any environment variables it needs access to should be added to the `run_nginx.sh` script.

### Useful Docker commands

- **SSH into a remote Docker machine:** `docker-machine ssh <machine-name>` - Docker automatically automatically generates and manages SSH keys when creating new virtual machines
- **Open an interactive terminal inside a running container:** `docker exec -it <container-name> bash` - Alternatively, you can replace `bash` with a one off command to run (no quotes needed)
- **Copy files to a remote virtual machine:** `docker-machine scp -r -d /path/to/local/directory/ myvm:/path/to/remote/directory/` - In general, shouldn't need to do this since we're just running containers in production. See https://docs.docker.com/machine/reference/scp/ for more details.
- **Reset docker-machine env variables so that the daemon is interacting with your local Docker engine:** `eval $(docker-machine env -u)`
- **Tear down a remote virtual machine:** `docker-machine stop <vm-name> && docker-machine rm <vm-name>`

### Helpful articles

- [How to Manage Multiple System Configurations Using Docker Compose](https://pspdfkit.com/blog/2018/how-to-manage-multiple-system-configurations-using-docker-compose/)
- [How to Use Docker Compose to Run Multiple Instances of a Service in Development](https://pspdfkit.com/blog/2018/how-to-use-docker-compose-to-run-multiple-instances-of-a-service-in-development/)
- [How to Update a Single Running docker-compose Container](https://staxmanade.com/2016/09/how-to-update-a-single-running-docker-compose-container/)
- [Run Multiple Docker Environments from the Same docker-compose File](https://staxmanade.com/2016/07/run-multiple-docker-environments--qa--beta--prod--from-the-same-docker-compose-file-/)
- [An Easy Recipe for Creating a PostgreSQL Cluster with Docker Swarm](https://info.crunchydata.com/blog/an-easy-recipe-for-creating-a-postgresql-cluster-with-docker-swarm)
- [Automated Nginx Reverse Proxy for Docker](http://jasonwilder.com/blog/2014/03/25/automated-nginx-reverse-proxy-for-docker/)
- [Docker Service Discovery Using Etcd and Haproxy](http://jasonwilder.com/blog/2014/07/15/docker-service-discovery/)
- [jwilder/dockerize](https://github.com/jwilder/dockerize)
- [Docker Machine: Basic Examples](https://www.macadamian.com/learn/docker-machine-basic-examples/)
- [Rolling updates with Docker Swarm](https://container-solutions.com/rolling-updates-with-docker-swarm/)
- [Don't use nodemon, there are better ways!](https://codeburst.io/dont-use-nodemon-there-are-better-ways-fc016b50b45e)
- [Using Docker-Compose Auto-Scaling to Scale Node.js Instances on a Single Machine](http://blog.lookfar.com/blog/2015/10/29/docker-compose-auto-scaling-node/)
- [JrCs/docker-letsencrypt-nginx-proxy-companion](https://github.com/JrCs/docker-letsencrypt-nginx-proxy-companion)
- [Minimal nginx configuration for front end development](http://www.staticshin.com/minimal-nginx-configuration-for-front-end-development/)
- [Definitely an openresty guide](http://www.staticshin.com/programming/definitely-an-open-resty-guide/)
- [Nginx HTTP server boilerplate configs](https://github.com/h5bp/server-configs-nginx)
- [Docker Tip #34: Should You Use Docker Compose in Production?](https://nickjanetakis.com/blog/docker-tip-34-should-you-use-docker-compose-in-production)
- [10 Tips for Docker Compose in Production](https://blog.cloud66.com/10-tips-for-docker-compose-hosting-in-production/)
- [9 Critical Decisions for Running Docker in Production](https://blog.cloud66.com/9-crtitical-decisions-needed-to-run-docker-in-production/)
- [8 Components You Need to Run Containers in Production](https://blog.cloud66.com/8-components-you-need-to-run-containers-in-production/)
- [How to Use Docker Compose to Run Multiple Instances of a Service in Development](https://pspdfkit.com/blog/2018/how-to-use-docker-compose-to-run-multiple-instances-of-a-service-in-development/)
- [How To Use Traefik as a Reverse Proxy for Docker Containers](https://www.digitalocean.com/community/tutorials/how-to-use-traefik-as-a-reverse-proxy-for-docker-containers-on-ubuntu-16-04)
- [Load balance with Traefik and Automatically detect new service instances, no need to restart the reverse-proxy](https://github.com/containous/traefik/tree/master/examples/quickstart)
- [Tips for deploying nginx (official image) with docker](https://blog.docker.com/2015/04/tips-for-deploying-nginx-official-image-with-docker/)
- [How To Secure a Containerized Node.js Application with Nginx, Let's Encrypt, and Docker Compose](https://www.digitalocean.com/community/tutorials/how-to-secure-a-containerized-node-js-application-with-nginx-let-s-encrypt-and-docker-compose#step-2-%E2%80%94-defining-the-web-server-configuration)

### Issues

- Need to convert nginx to use environment variables [as much as possible](https://docs.docker.com/samples/library/nginx/#using-environment-variables-in-nginx-configuration)
- We are ignoring `.migrate` in `.dockerignore` because we need to make sure that the production database sees new migrations and the `.migrate` file is typically going to be up to date with the development database, not production. The issue with this is that images will get built without this file and therefore every time we need to update the production database schema, _every single up migration will be run_. If our up migrations are idempotent, as they should be, then this shouldn't necessarily be an issue, but it isn't ideal. Need to look into storing migration status _in the database itself_.
- There are two options I'm aware of for dynamically discovering new service instances when scaling up and load balancing to them. This is a major issue that needs to be solved. When a service is scaled up with new instances, the load balancer needs to be aware of the new instances. But more importantly, when an instance fails, the load balancer needs to know not to send traffic to that destination. Even when the Docker engine replaces the failed instance with a healthy instance, the load balancer needs to updated with the new address/HOSTNAME of the new instance.
  - [traefik, which handles this natively...](https://github.com/containous/traefik/blob/ac6b11037dabd4dd64f75c486d6c68ef3c5e9eb9/docs/content/getting-started/quick-start.md)
  - [Automated nginx proxy for Docker containers using docker-gen](https://github.com/jwilder/nginx-proxy)

### Scratchpad

- consider replacing node-migrate with squitch
- setup CI/CD pipeline that handles dev, staging, and blue/green prod
- investigate how a reverse-proxy such as nginx, traefik, caddy, or node-http-proxy would fit into the architecture
  - I'm thinking that the reverse-proxy is what should be exposed to the internet, rather than the node service that contains the auth logic
  - the reverse-proxy server can then delegate to the node service, and any other service, as necessary
- setup a testing suite (possibly as another docker service)
- establish a better database query layer to support a more restful api (or JSON-RPC)
  - many options here: pg-promise, massive, squel, knex, sqitch, node-db-migrate, node-migrate, flyway, sequelize, typeorm, umzug, slonik, etc
- refactor the auth service into [MVC](https://itnext.io/a-new-and-better-mvc-pattern-for-node-express-478a95b09155) [architecture](http://timstermatic.github.io/blog/2013/08/17/a-simple-mvc-framework-with-node-and-express/). Look at upgrading to Egg or Adonis.
- setup [EC2 autoscaling and ELB load balancing](https://docs.aws.amazon.com/autoscaling/ec2/userguide/autoscaling-load-balancer.html)
- setup production database. AWS RDS, AWS Aurora, Digital Ocean block storage, Digital Ocean managed database, etc.
- build a frontend service
- As mentioned in the Issues section, we are looking to solve the issue of when a container fails as it relates to load balancing. But, what about when the _process inside the container fails, but the container itself is still healthy?_ Is this even possible? Need to come up with a way to test this out.
- despite what was mentioned in the "scaling your services" section, it may still be possible to scale out with docker-compose by utilizing AWS elastic load balancer combined with auto scaling groups. In this scenario, you would have a fleet of docker-compose fleets.
- look into the concept of "health checks" and whether it is applicable to this architecture
- see this [github issue](https://github.com/dmfay/massive-js/issues/663#issuecomment-459915014) regarding massive
- see this [github issue](https://github.com/brianc/node-postgres/issues/1151#issuecomment-461534295) regarding express

### High level project goals

- Utilize the Docker platform (containers, compose, swarm)
- Embrace GitOps
- Generalized enough to be used for bootstrapping new projects quickly
- Rapid bootstrapping process
- Multiple environments (dev, testing, staging, prod, etc)
- Environment parity
- Blue/green deployments preferred, rolling deployments acceptable
- Simple database migrations
- CI/CD pipeline that runs testing suite and automates deployments
- Cloud agnostic (deploy anywhere)
- Language agnostic (individual services can be written in any language)
- Strategy for managing and distributing secrets
- DRY config utilizing environment variables
- High availability (many instances, multiple hosts, auto-healing, zero downtime deployments, protection from (D)DOS attacks)
- Scaling, and possibly auto-scaling
- Service oriented (rather than monolithic)
- Stateless and decoupled
- Database backups
- Secure (peer review necessary)
- Immutable deployments and easy rollback
- Strategy for implementing cross-cutting functionality i.e. sidecar pattern (logging, authorization, etc.)

### Scaling your services (deprecated section)

> This section on scaling services to run multiple instances is deprecated due to struggles with inter-service communication. There are two popular approaches to asynchronous inter-service communication... pub-sub and message queuing.

> Pub-sub is a pattern where a publisher can broadcast a message to a channel and any interested parties (subscribers) will be notified of the message. The issue is when you have a service that is a subscriber, and you scale that service to have multiple instances, then _each and every instance receives the message and attempts to respond accordingly_, when in reality it would only be appropriate for one of the instances to respond. For example, if there were three instances of the mail service and it was subscribed to the mail channel, it would send _three emails_ each time it received an instruction to send an email.

> The next common pattern for asynchronous inter-service communications is a message queue. This pattern is actually achievable, even when scaling services to include multiple instances, but I wasn't a fan of my implementation. It involved a redis list (the queue) that services could push messages to. Then, the publishing service would broadcast an update to all other services using pub-sub to notify them that a new message was added to the queue. Then, services would peek at the queue to see if the message something they could process, and if so, it would pop the message off the queue and respond accordingly. Since there is only one message, it's not possible for multiple instances of the same service get the message. In the end though, it didn't seem like a very elegant solution and it required services to be aware of the fact that they were embedded in a distributed application, so I scrapped it.

> Multiple paths forward, but can only choose one...

- Continue utilizing scaled services and allow services to communicate with each other directly through the load balancer, at the cost of coupling services together.
- Pull all the services together into a single monolith, largely doing away with the need for messaging but still allowing the monolith to scale if it is kept stateless.
- Continue using redis pub-sub, but don't allow services to scale. I'm going with this option because it maintains the microservices pattern which will allow for an easier migration path to something like kubernetes in the future. A platform like kubernetes will be better equipped to tackle some of these messaging/scaling issues anyway.

Scaling services to use more instances is exceptionally easy with docker-compose. Just run `docker-compose up -d --scale <service-name>=<no. of instances>`. The `<service-name>` comes from how you've named your service inside `docker-compose.yml`. The docker engine manages inter-service communication, including load balancing this communication.

In a vanilla docker-compose application, Docker will handle inter-service communication and load balance appropriately, and services are permitted to communicate directly with each other. However, since we are using nginx-proxy as our reverse-proxy/load balancer, it will take over the reigns of this task. In this setup, for Service A to communicate with Service B it must send it's request through nginx-proxy.

The benefit of nginx-proxy over a more basic nginx setup is that it comes with service discovery built-in. This means that when we scale up a service, or when a service has an instance die, nginx-proxy is aware of this and handles the load balancing appropriately.

_Note: docker-compose is limited to container orchestration on a single host, as opposed to Docker Swarm or Kubernetes which can manage containers across multiple host machines. A natural question to ask is, Why bother with scaling at all? The answer has to do with maintaining availability in the event of instance failures. If you only have one instance of the `auth` service running and it goes down, your application will be unavailable for the period of time it takes Docker to replace the failed container. If, however, you have multiple instances of the `auth` service running the load balancer can distribute traffic to the healthy instances while Docker is bringing the failed instance back up. Keep in mind that this form of "scaling" only improves availability and not raw compute power. To take on higher volumes of traffic to your application, you will still need to scale vertically by increasing the size/power of your host machine._

_Note: Only stateless services can be scaled. Stateful services, such as the database, cannot be scaled. Neither can any services that have a port bound to the host, such as the nginx reverse-proxy. In the case of nginx, Docker will fail with the message `WARNING: The "nginx" service specifies a port on the host. If multiple containers for this service are created on a single host, the port will clash.`_

### Accessing the Application (deprecated section)

> This project used to use something called nginx-proxy to handle reverse proxying and load balancing. See this Stack Overflow [answer](https://stackoverflow.com/a/55536190/5265805) to understand why we needed to switch back to a regular nginx setup.

All services that are provided with the `VIRTUAL_HOST` and optional `VIRTUAL_PORT` environment variables are automatically managed by nginx-proxy. This means that they are by default exposed to the outside world via nginx-proxy. As an example, the auth service contains `VIRTUAL_HOST=auth.local` and `VIRTUAL_PORT=3000`. To hit the signup endpoint send a POST to `localhost:8080/signup` with the header `Host: auth.local:3000`. To hit this endpoint internally from another service, change the URL to `http://nginx/signup` and keep the same Host header.

What about when we don't have the opportunity to provide the Host header, like when we navigate to a URL in the browser? In this case, nginx-proxy will assume that Host is the same as the URL. For this reason, whatever service is responsible for serving up the frontend should have it's `VIRTUAL_HOST` set to `localhost` in development and the production URL in production.
