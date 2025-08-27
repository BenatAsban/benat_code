import React, { Component } from 'react';
import PostAuthor from "../Components/PostAuthor";

export default class Model extends Component {
    constructor(props) {
        super(props);
        this.state = {
            postLists: []
        };
    }

    render() {
        let modelStyle = {
            display: "black"
        };

        return (
            <section className="post-detail">
                <div className="container post-detail__container" style={modelStyle}>
                    <div className="post-detail__header">
                        <PostAuthor />
                    </div>
                    <h1>{this.props.postTitle}</h1>
                    <div className="post-detail__thumbnail">
                        <img src={this.props.image} alt="" />
                    </div>
                    <p>{this.props.shortDescriptiom.replace(/<p>|<\/p>|<br\s*\/?>/g, '')}</p>
                </div>
            </section>
        );
    }
}