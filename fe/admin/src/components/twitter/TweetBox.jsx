import React, { useEffect, useState } from 'react';
import TweetData from './TweetData';
const TweetBox = ({ quote }) => {
    
    return (
        <div className="col-lg-12" style={{paddingBottom: '50px',marginLeft: '100px'}}>
            <div className="card">
                <div className="card-title">
                    <h4>RECENT TWEETS AND NEWS ABOUT {quote}</h4>
                </div>
                <div className="card-body">
                    <div className="table-responsive">
                        <table className="table" >
                            <thead>
                                <tr>
                                    <th>#</th>
                                    <th>Tweets</th>
                                    <th></th>
                                    <th></th>
                                    <th></th>
                                </tr>
                            </thead>
                            <tbody>
                                <tr>
                                    <td>
                                        <div className="round-img">
                                            <a href="https://twitter.com/">
                                                <img
                                                    style={{ padding: '0px', width: '300px', height: '300px' }}
                                                    src={`https://static.vecteezy.com/system/resources/previews/042/148/642/non_2x/new-twitter-x-logo-twitter-icon-x-social-media-icon-free-png.png`}
                                                    alt=""
                                                />
                                            </a>
                                        </div>
                                    </td>
                                    <td>
                                        <TweetData />
                                    </td>
                                    <td><span></span></td>
                                    <td><span></span></td>
                                    <td><span className="badge badge-success"></span></td>
                                </tr>
                            </tbody>
                        </table>
                    </div>
                </div>
            </div>
        </div>
    );
}

export default TweetBox;