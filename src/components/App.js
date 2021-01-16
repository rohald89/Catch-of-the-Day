import React from 'react';
import PropTypes from 'prop-types';
import Header from './Header';
import Order from './Order';
import Inventory from './Inventory';
import sampleFishes from '../sample-fishes';
import Fish from './Fish';
import base from '../base';

class App extends React.Component{
    state = {
        fishes: {},
        order: {}
    };

    static propTypes = {
        match: PropTypes.object
    }

    componentDidMount() {
        const {params} = this.props.match;
        // frst reinstate our local storage
        const localStorageRef = localStorage.getItem(params.storeid);
        if(localStorageRef){
            this.setState({order: JSON.parse(localStorageRef)})
        }
        this.ref = base.syncState(`${params.storeid}/fishes`, {
            context: this,
            state: 'fishes'
        });
    }

    componentWillUnmount(){
        base.removeBinding(this.ref);
    }

    componentDidUpdate() {
        console.log(this.state.order);
        localStorage.setItem(this.props.match.params.storeid, JSON.stringify(this.state.order))
    }

    addFish = (fish) => {
        // Take a copy of the exsisting state
        const fishes = {...this.state.fishes};
        // Add new fish to fishes variable
        fishes[`fish${Date.now()}`]=fish;
        // set the new fishes object to state
        this.setState({ fishes })
    }

    updateFish = (key, updatedFish) => {
        // take a copy of the current state
        const fishes = { ...this.state.fishes };
        // update that state
        fishes[key] = updatedFish;
        // set that to state
        this.setState({ fishes });
    }

    deleteFish = (key) => {
        // copy state
        const fishes = {...this.state.fishes};
        // update state
        fishes[key] = null;
        this.setState({fishes});
    }

    loadSampleFishes = () => { this.setState({fishes: sampleFishes})}

    addToOrder = (key) => {
        // take a copy of state 
        const order = {...this.state.order}
        // add to the order or update the number in the order
        order[key] = order[key] + 1 || 1;
        // call setState to update the state object
        this.setState({ order });
    }

    removeFromOrder = (key) => {
        // take a copy of state 
        const order = {...this.state.order}
        // remove item from order
        delete order[key];
        // call setState to update the state object
        this.setState({ order });
    }

    render() {
        return(
            <div className="catch-of-the-day">
                <div className="menu">
                    <Header tagline="Fresh Seafood Market"/>
                    <ul className="fishes">
                        {Object.keys(this.state.fishes).map(key => (
                            <Fish 
                            key={key} 
                            index={key}
                            details={this.state.fishes[key]} 
                            addToOrder={this.addToOrder} 
                            />
                        ))} 
                    </ul>
                    
                </div>
                    <Order fishes={this.state.fishes} order={this.state.order} removeFromOrder={this.removeFromOrder}/>
                    <Inventory addFish={this.addFish} loadSampleFishes={this.loadSampleFishes} updateFish={this.updateFish} deleteFish={this.deleteFish} fishes={this.state.fishes}/>
            </div>
        );
    }
}

export default App;