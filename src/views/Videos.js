import React from 'react'
import { Container, Row, Col, Card, CardHeader, CardBody, Badge } from "shards-react";
import PageTitle from '../components/common/PageTitle';

export default class Videos extends React.Component {
    constructor(props) {
        super(props)

        this.state = {
            PostsListTwo: [
                {
                    backgroundImage: "https://1.bp.blogspot.com/-yJHFsIQJz8Y/XfbkBdRHVaI/AAAAAAAAATo/XBPdxbYfJvoYnWL1ZpIp7pXUo1ILVC-igCLcBGAsYHQ/s1600/1-399-270.png",
                    category: "Travel",
                    categoryTheme: "info",
                    author: "Anna Ken",
                    authorAvatar: require("../images/avatars/0.jpg"),
                    title:
                        "Kurulus Osman Episode 1",
                    body:
                        "Conviction up partiality as delightful is discovered. Yet jennings resolved disposed exertion you off. Left did fond drew fat head poor jet pan flying over...",
                    date: "29 February 2019"
                },
                {
                    backgroundImage: "https://i2.wp.com/rapidvirals.com/wp-content/uploads/2020/06/2-6.jpg?w=850&ssl=1",
                    category: "Business",
                    categoryTheme: "dark",
                    author: "John James",
                    authorAvatar: require("../images/avatars/1.jpg"),
                    title:
                        "Kurulus Osman Episode 2",
                    body:
                        "Discovered had get considered projection who favourable. Necessary up knowledge it tolerably. Unwilling departure education to admitted speaking...",
                    date: "29 February 2019"
                }
            ],
        }
    }

    render() {
        const { PostsListTwo } = this.state
        return (
            <Container fluid className="main-content-container px-4">
                <Row noGutters className="page-header py-4">
                    <PageTitle sm="4" title="My Videos" subtitle="Blog Posts" className="text-sm-left" />
                </Row>


                <Row>
                    {PostsListTwo.map((post, idx) => (
                        <Col lg="12" sm="12" className="mb-4" key={idx}>
                            <Card small className="card-post card-post--aside card-post--1">
                                <div
                                    className="card-post__image"
                                    style={{ backgroundImage: `url('${post.backgroundImage}')` }}
                                >
                                    {/* <Badge
                                        pill
                                        className={`card-post__category bg-${post.categoryTheme}`}
                                    >
                                        {post.category}
                                    </Badge> */}
                                    {/* <div className="card-post__author d-flex">
                                        <a
                                            href="#"
                                            className="card-post__author-avatar card-post__author-avatar--small"
                                            style={{ backgroundImage: `url('${post.authorAvatar}')` }}
                                        >
                                            Written by Anna Ken
                                        </a>
                                    </div> */}
                                </div>
                                <CardBody>
                                    <h5 className="card-title">
                                        <a className="text-fiord-blue" href="#">
                                            {post.title}
                                        </a>
                                    </h5>
                                    <p className="card-text d-inline-block mb-3">{post.body}</p>
                                    <span className="text-muted">{post.date}</span>
                                </CardBody>
                            </Card>
                        </Col>
                    ))}
                </Row>
            </Container>
        )
    }
}
