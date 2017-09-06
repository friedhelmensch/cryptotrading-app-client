import React, { Component } from 'react';
import { withRouter } from 'react-router-dom';
import {
    PageHeader,
    ListGroup,
    ListGroupItem
} from 'react-bootstrap';
import './Orders.css';
import { invokeApig } from '../libs/awsLib';

class Orders extends Component {

    constructor(props) {
        super(props);
        this.state = {
            isLoading: false,
            orders: [],
        };
    }

    async componentDidMount() {

        this.setState({ isLoading: true });

        try {
            const orders = await this.getOrders();
            this.setState({ orders: orders });
        }
        catch (e) {
            alert(e);
        }

        this.setState({ isLoading: false });
    }

    getOrders() {
        return invokeApig({ path: '/orders' }, this.props.userToken);
    }

    renderOrdersList(orders) {
        if(orders.length === 0) return;
        return orders.map((order, i) => (
            (<ListGroupItem
                key = {i}
                header={order.summary.trim().split('\n')[0]}>
                {"Cost: " + order.cost} <br/>
                {"Status: " + order.status} <br/>
                {"Date: " + (new Date(order.opentime * 1000)).toLocaleString()} <br/>
            </ListGroupItem>)
        ));
    }

    render() {
        return (
            <div className="Home">
                <div className="settings">
                    <PageHeader>Your Orders</PageHeader>
                    <ListGroup>
                        {!this.state.isLoading
                            && this.renderOrdersList(this.state.orders)}
                    </ListGroup>
                </div>
            </div>
        );
    }
}

export default withRouter(Orders);