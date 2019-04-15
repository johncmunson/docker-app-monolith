import { createSelector } from 'reselect'

const selectedCategories = (state, ownProps) =>
  state.invoicing.categories.filter(category => category.selected)

export default createSelector(
  selectedCategories,
  value => value
)
