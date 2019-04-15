import { createSelector } from 'reselect'

const unselectedCategories = (state, ownProps) =>
  state.invoicing.categories.filter(category => !category.selected)

export default createSelector(
  unselectedCategories,
  value => value
)
