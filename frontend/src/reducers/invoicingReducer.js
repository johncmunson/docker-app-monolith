import produce from 'immer'

const initialState = {
  categories: [
    { id: 1, value: 'hood', label: 'Hood', price: 0, selected: false },
    {
      id: 2,
      value: 'rightQuarterPanel',
      label: 'Right Quarter Panel',
      price: 0,
      selected: false
    },
    { id: 3, value: 'roof', label: 'Roof', price: 0, selected: false },
    {
      id: 4,
      value: 'leftRearDoor',
      label: 'Left Rear Door',
      price: 0,
      selected: false
    }
  ],
  rni: [
    { id: 1, categoryId: 1, value: 'grille', label: 'Grille', hours: 0 },
    {
      id: 2,
      categoryId: 1,
      value: 'windShield',
      label: 'Wind Shield',
      hours: 0
    },
    { id: 3, categoryId: 1, value: 'fogLamp', label: 'Fog Lamp', hours: 0 },
    {
      id: 4,
      categoryId: 2,
      value: 'rightRearSkirt',
      label: 'Right Rear Skirt',
      hours: 0
    },
    {
      id: 5,
      categoryId: 2,
      value: 'rightTailLight',
      label: 'Right Tail Light',
      hours: 0
    },
    {
      id: 6,
      categoryId: 2,
      value: 'rightWheelLiner',
      label: 'Right Wheel Liner',
      hours: 0
    },
    {
      id: 7,
      categoryId: 3,
      value: 'vanityVisorLeft',
      label: 'Vanity Visor Left',
      hours: 0
    },
    {
      id: 8,
      categoryId: 3,
      value: 'vanityVisorRight',
      label: 'Vanity Visor Right',
      hours: 0
    },
    {
      id: 9,
      categoryId: 3,
      value: 'roofRackTrim',
      label: 'Roof Rack - Trim',
      hours: 0
    },
    {
      id: 10,
      categoryId: 4,
      value: 'leftRearDoor',
      label: 'Left Rear Door',
      hours: 0
    },
    {
      id: 11,
      categoryId: 4,
      value: 'leftHingedDoor',
      label: 'Left Hinged Door',
      hours: 0
    },
    {
      id: 12,
      categoryId: 4,
      value: 'leftSlidingDoor',
      label: 'Left Sliding Door',
      hours: 0
    }
  ],
  rp: [
    { id: 1, categoryId: 1, value: 'grille', label: 'Grille', hours: 0 },
    {
      id: 2,
      categoryId: 1,
      value: 'windShield',
      label: 'Wind Shield',
      hours: 0
    },
    { id: 3, categoryId: 1, value: 'fogLamp', label: 'Fog Lamp', hours: 0 },
    {
      id: 4,
      categoryId: 2,
      value: 'rightRearSkirt',
      label: 'Right Rear Skirt',
      hours: 0
    },
    {
      id: 5,
      categoryId: 2,
      value: 'rightTailLight',
      label: 'Right Tail Light',
      hours: 0
    },
    {
      id: 6,
      categoryId: 2,
      value: 'rightWheelLiner',
      label: 'Right Wheel Liner',
      hours: 0
    },
    {
      id: 7,
      categoryId: 3,
      value: 'vanityVisorLeft',
      label: 'Vanity Visor Left',
      hours: 0
    },
    {
      id: 8,
      categoryId: 3,
      value: 'vanityVisorRight',
      label: 'Vanity Visor Right',
      hours: 0
    },
    {
      id: 9,
      categoryId: 3,
      value: 'roofRackTrim',
      label: 'Roof Rack - Trim',
      hours: 0
    },
    {
      id: 10,
      categoryId: 4,
      value: 'leftRearDoor',
      label: 'Left Rear Door',
      hours: 0
    },
    {
      id: 11,
      categoryId: 4,
      value: 'leftHingedDoor',
      label: 'Left Hinged Door',
      hours: 0
    },
    {
      id: 12,
      categoryId: 4,
      value: 'leftSlidingDoor',
      label: 'Left Sliding Door',
      hours: 0
    }
  ]
}

export default function invoicingReducer(
  state = initialState,
  { type, payload }
) {
  switch (type) {
    case 'TOGGLE_CATEGORY': {
      const { id } = payload
      const nextState = produce(state, draftState => {
        draftState.categories.forEach(category => {
          if (id === category.id) category.selected = !category.selected
        })
        draftState.rni.forEach(item => {
          if (id === item.categoryId) item.hours = 0
        })
        draftState.rp.forEach(item => {
          if (id === item.categoryId) item.hours = 0
        })
      })
      return nextState
    }
    case 'PRICE_CHANGE': {
      const { id, price } = payload
      const nextState = produce(state, draftState => {
        draftState.categories.forEach(category => {
          if (id === category.id) {
            category.price = price
          }
        })
      })
      return nextState
    }
    case 'HOURS_CHANGE': {
      const { id, hours, type } = payload
      const nextState = produce(state, draftState => {
        draftState[type].forEach(item => {
          if (id === item.id) {
            item.hours = hours
          }
        })
      })
      return nextState
    }
    case 'RESET': {
      return initialState
    }
    default: {
      return state
    }
  }
}
