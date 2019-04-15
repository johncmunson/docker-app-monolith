import { isValidJSONString } from './utilities'

test('valid JSON string is valid', () => {
  expect(
    isValidJSONString('{"name":"John", "age":31, "city":"New York"}')
  ).toBe(true)
})

test('invalid JSON string is invalid', () => {
  expect(
    isValidJSONString("{'name':'John', 'age':31, 'city':'New York'}")
  ).toBe(false)
})

// `base64encode` and `base64decode` rely on browser native methods
// so to test them we need to configure a tool like JSDOM or something
// test('properly encode to base64', () => {
//   expect(base64encode('Hello World!')).toBe('SGVsbG8gV29ybGQh')
// })
// test('properly decode from base64', () => {
//   expect(base64encode('SGVsbG8gV29ybGQh')).toBe('Hello World!')
// })
