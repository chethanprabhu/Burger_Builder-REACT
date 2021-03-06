import React, { Component } from  "react";
import Burger from "../../components/Burger/Burger"
import BurgerControls from "../../components/Burger/BurgerControls/BurgerControls"
import Modal from "../../components/UI/Modal/Modal"
import OrderSummary from "../../components/Burger/OrderSummary/OrderSummary";
import axios from "../../axios/axios-orders"
import Spinner from "../../components/UI/Spinnner/Spinner"
import withErrorHandling from "../../hoc/withErrorHandling/withErrorHandling"

const INGREDIENT_PRICE = {
    salad: 20,
    cheese: 30,
    meat: 50,
    bacon: 40
}

class BurgerBuilder extends Component {

    state = {
        ingredients: null,
        totalPrice: 50,
        ordered: false,
        loading: false,
        error: false
    } 

    componentDidMount() {
        axios("https://react-my-burger-ea404.firebaseio.com/ingredients.json")
            .then(response => {
                this.setState({ingredients: response.data})
            })
            .catch(() => {
                this.setState({error: true})
            })
    }

    toggleOrdered = () => {
        this.setState({ordered: true})
    }

    addHandler = (type) => {
        this.setState({
            ingredients: {
            ...this.state.ingredients,
            [type]: this.state.ingredients[type] + 1
        }, totalPrice: this.state.totalPrice + INGREDIENT_PRICE[type]})
    } 

    removeHandler = (type) => {
        this.setState({
            ingredients: {
            ...this.state.ingredients,
            [type]: this.state.ingredients[type] ? this.state.ingredients[type] - 1: 0
        }, totalPrice: this.state.totalPrice - INGREDIENT_PRICE[type]})
    }

    backdropClickedHandler = () => {
        this.setState({
            ordered: false
        })
    }

    orderContinueHandler = () => {
        let queryString = [];
        for(let i in this.state.ingredients) {
            queryString.push(i + "=" + this.state.ingredients[i])
        } 
        

        this.props.history.push({
            pathname: "checkout",
            search: queryString.join("&")
        });
    }

    

    render() {

        let orderSummary = null;

        let burger = this.state.error? <React.Fragment>
                <h1>OH NO! WE ARE SORRY</h1>
                <p>We are facing issues with our servers. Please try again later. Sorry for the inconvenience caused</p> 
            </React.Fragment>
            : <Spinner/>

        if(this.state.ingredients) {
            burger = 
            <React.Fragment>
                <Burger ingredients={this.state.ingredients}/>
                <BurgerControls more={(type) => this.addHandler(type)} 
                                less={(type) => this.removeHandler(type)}
                                state={this.state}
                                orderClicked={this.toggleOrdered}/>
            </React.Fragment>

            orderSummary = <OrderSummary cancle={this.backdropClickedHandler} continue={this.orderContinueHandler} 
                ing={this.state.ingredients} price={this.state.totalPrice}/>
        }

        if(this.state.loading) {
            orderSummary = <Spinner/>
        }

    
        return (
            <React.Fragment>
                <Modal backdropClicked={this.backdropClickedHandler} ordered={this.state.ordered}>
                    {orderSummary}
                </Modal>
                {burger}
            </React.Fragment>
        )
    }
}

export default withErrorHandling(BurgerBuilder, axios);