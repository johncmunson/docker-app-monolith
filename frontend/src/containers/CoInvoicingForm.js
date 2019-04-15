import { connect } from 'react-redux'
import InvoicingForm from '../components/InvoicingForm'
import SelectedCategoriesSelector from '../selectors/selected_categories'
import UnselectedCategoriesSelector from '../selectors/unselected_categories'
import hoursChange from '../actions/hoursChange'
import priceChange from '../actions/priceChange'
import reset from '../actions/reset'
import toggleCategory from '../actions/toggleCategory'

const mapStateToProps = state => ({
  selectedCategories: SelectedCategoriesSelector(state),
  unselectedCategories: UnselectedCategoriesSelector(state),
  rni: state.invoicing.rni,
  rp: state.invoicing.rp
})

const mapDispatchToProps = dispatch => ({
  handleHoursChange: payload => dispatch(hoursChange(payload)),
  handlePriceChange: payload => dispatch(priceChange(payload)),
  handleReset: () => dispatch(reset()),
  handleToggleCategory: payload => dispatch(toggleCategory(payload))
})

const CoInvoicingForm = connect(
  mapStateToProps,
  mapDispatchToProps
)(InvoicingForm)

export default CoInvoicingForm
