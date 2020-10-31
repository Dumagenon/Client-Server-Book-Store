import { Switch, Route, Redirect } from 'react-router-dom';
import CreateBookPage from './pages/create-book-page';
import BookPage from './pages/book-page';
import AuthPage from './pages/auth-page/';
import CatalogPage from './pages/catalog-page/'
import CartPage from './pages/cart-page';
import ReviewsPage from './pages/reviews-page';

export const useRoutes = isAuth => {
  if (isAuth) {
    return (
      <Switch>
        <Route exact path="/" component={CatalogPage} />
        <Route exact path="/create" component={CreateBookPage} />
        <Route exact path="/book/:id" component={BookPage} />
        <Route exact path="/cart" component={CartPage} />
        <Route exact path="/reviews" component={ReviewsPage} />
        <Redirect to="/" />
      </Switch>
    )
  }

  return (
    <Switch>
      <Route path="/" exact component={CatalogPage} />
      <Route path="/auth" exact component={AuthPage} />
      <Redirect to="/auth" />
    </Switch>
  )
}