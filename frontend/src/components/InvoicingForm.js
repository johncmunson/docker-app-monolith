import React, { Component } from 'react'
import Select from 'react-select'
import styled from 'styled-components'

const breakpoint = '750px'

const DeleteLineItem = styled.span`
  color: red;
  :hover {
    cursor: pointer;
  }
`

const HoursWrapper = styled.div`
  display: flex;
  justify-content: space-between;
  margin: 0 0 1em 2em;
  @media (max-width: ${breakpoint}) {
    flex-direction: column;
  }
`

const HoursColumnSpacer = styled.br`
  display: none;
  @media (max-width: ${breakpoint}) {
    display: block;
  }
`

// convert this to a function component
export default class InvoicingForm extends Component {
  handleChange = selectedOption => {
    this.props.handleToggleCategory({ id: selectedOption.id })
  }
  render() {
    const { handleChange } = this
    const {
      selectedCategories,
      unselectedCategories,
      rni,
      rp,
      handleHoursChange,
      handlePriceChange,
      handleReset,
      handleToggleCategory
    } = this.props
    return (
      <div style={{ margin: '1em' }}>
        <br />
        <button
          onClick={handleReset}
          style={{
            float: 'right',
            height: '3.4em',
            zIndex: '99',
            position: 'relative'
          }}
        >
          Reset Form
        </button>
        <Select
          onChange={handleChange}
          options={unselectedCategories}
          placeholder="Add a line item..."
        />
        <br />
        {selectedCategories.map((category, i) => (
          <div key={i}>
            <div
              style={{
                display: 'flex',
                justifyContent: 'space-between',
                alignItems: 'baseline'
              }}
            >
              <h3>
                <DeleteLineItem
                  onClick={() => handleToggleCategory({ id: category.id })}
                >
                  (x)
                </DeleteLineItem>
                &nbsp;<b>{category.label}</b>
              </h3>
              <label>
                PDR Price:&nbsp;
                <input
                  type="number"
                  value={category.price || ''}
                  onChange={e => {
                    handlePriceChange({
                      id: category.id,
                      price: parseFloat(e.target.value || 0)
                    })
                  }}
                />
              </label>
            </div>
            <HoursWrapper>
              <div>
                <h4
                  style={{
                    textDecoration: 'underline',
                    marginBottom: '0.5em',
                    marginTop: '0'
                  }}
                >
                  RNI:
                </h4>
                {rni
                  .filter(item => item.categoryId === category.id)
                  .map((item, i) => (
                    <div
                      key={i}
                      style={{
                        display: 'flex',
                        justifyContent: 'space-between'
                      }}
                    >
                      <div style={{ marginRight: '2em' }}>{item.label}:</div>
                      <label>
                        Hrs:&nbsp;
                        <input
                          type="number"
                          value={item.hours || ''}
                          onChange={e => {
                            handleHoursChange({
                              id: item.id,
                              hours: parseFloat(e.target.value || 0),
                              type: 'rni'
                            })
                          }}
                        />
                      </label>
                    </div>
                  ))}
              </div>
              <HoursColumnSpacer />
              <div>
                <h4
                  style={{
                    textDecoration: 'underline',
                    marginBottom: '0.5em',
                    marginTop: '0'
                  }}
                >
                  RP:
                </h4>
                {rp
                  .filter(item => item.categoryId === category.id)
                  .map((item, i) => (
                    <div
                      key={i}
                      style={{
                        display: 'flex',
                        justifyContent: 'space-between'
                      }}
                    >
                      <div style={{ marginRight: '2em' }}>{item.label}:</div>
                      <label>
                        Hrs:&nbsp;
                        <input
                          type="number"
                          value={item.hours || ''}
                          onChange={e => {
                            handleHoursChange({
                              id: item.id,
                              hours: parseFloat(e.target.value || 0),
                              type: 'rp'
                            })
                          }}
                        />
                      </label>
                    </div>
                  ))}
              </div>
            </HoursWrapper>
            {i === selectedCategories.length - 1 ? null : (
              <div>
                <br />
                <hr />
              </div>
            )}
          </div>
        ))}
      </div>
    )
  }
}
