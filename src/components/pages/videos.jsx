import React, {Component} from 'react'
import Axios from "axios"

import {DaysToYears} from "../date"

import config from "../config"

class VideosPage extends Component {
    state = {
        limit: 24,
        data: []
    }

    render() {
        return (
            <div className="col-12">
                <div className="list-group">
                    {Object.keys(this.state.data).map((key, i) => (
                        <li key={i} className="list-group-item">
                            <span className="badge badge-primary badge-pill">
                                <DaysToYears>{this.state.data[key].age}</DaysToYears>
                            </span>

                            <a className="col-10" href={`video/${this.state.data[key].id}`}>
                                {this.state.data[key].name}
                            </a>
                        </li>
                    ))}
                </div>
            </div>
        )
    }

    componentDidMount() {
        this.getData()
    }

    getData(limit = this.state.limit) {
        Axios.get(`${config.api}/videos.php?limit=${limit}`)
            .then(({data}) => this.setState({data}))
    }
}

export default VideosPage