import React, { Component } from 'react'
import { Container, Row, Col, Card, CardHeader, CardBody, Badge, Button, Modal, ModalBody, ModalHeader, Form, FormInput, FormGroup, Alert, Collapse } from "shards-react";
import { Link, } from 'react-router-dom';
import PageTitle from '../components/common/PageTitle';
import firebase from '../config/firebase'
export default class Seasons extends Component {
    constructor(props) {
        super(props)

        this.state = {
            seasons: [],
            seasonModal: false,
            name: "",
            imageUrl: "",
            theme: '',
            visible: false,
            countdown: 0,
            timeUntilDismissed: 5,
            message: "",
            editing: false,
            editingId: "",
            episodeModal: false,
            episodeName: "",
            episodeVideoUrl: ""
        }
    }

    componentDidMount = () => {
        const { id } = this.props.match.params
        const { seasons } = this.state
        console.log("id", id)
        firebase.firestore().collection("series").doc(id).onSnapshot((doc) => {
            console.log("Current data: ", doc.data());
            this.setState({ seasons: doc.data().seasons })
        });

    }

    showAlert = (theme, message) => {
        this.clearInterval();
        this.setState({ visible: true, countdown: 0, timeUntilDismissed: 5, theme, message });
        this.interval = setInterval(this.handleTimeChange, 1000);
    }

    handleTimeChange = () => {
        if (this.state.countdown < this.state.timeUntilDismissed - 1) {
            this.setState({
                ...this.state,
                ...{ countdown: this.state.countdown + 1 }
            });
            return;
        }

        this.setState({ ...this.state, ...{ visible: false } });
        this.clearInterval();
    }

    clearInterval = () => {
        clearInterval(this.interval);
        this.interval = null;
    }


    seasonAdd = () => {
        const { imageUrl, name, editing, editingId, seasons } = this.state
        const { id } = this.props.match.params


        if (editing) {
            // let index = seasons.findIndex(x => x.id == editingId)
            if (imageUrl && name) {
                seasons[editingId].seasonName = name
                seasons[editingId].seasonImage = imageUrl
                firebase.firestore().collection("series").doc(id).update({
                    seasons
                })
                    .then((docRef) => {
                        // seasons[index].titleOfSeries = name
                        // seasons[index].displayImage = imageUrl
                        this.setState({ seasonModal: false, editing: false, seasons })
                        this.showAlert("success", "successfully Updated")
                        // console.log("Document written with ID: ", docRef.id);
                    })
                    .catch(function (error) {

                        console.error("Error adding document: ", error);
                    });
            } else {
                this.setState({ seasonModal: false, editing: false })
                this.showAlert("danger", "fil the form")
            }
        } else {
            let obj = {
                seasonName: name,
                seasonImage: imageUrl
            }
            if (imageUrl && name) {
                seasons.push(obj)
                firebase.firestore().collection("series").doc(id).update({
                    seasons
                })
                    .then((docRef) => {
                        this.setState({ seasonModal: false, seasons })
                        this.showAlert("success", "successfully added")
                        // console.log("Document written with ID: ", docRef.id);
                    })
                    .catch(function (error) {

                        console.error("Error adding document: ", error);
                    });
            } else {
                this.setState({ seasonModal: false })
                this.showAlert("danger", "fil the form")
            }
        }
    }

    episodeAdd = () => {
        const { episodeName, episodeVideoUrl, selectedIndex, seasons } = this.state
        const { id } = this.props.match.params

        let season = {
            ...seasons[selectedIndex]
        }

        if (season.episodes) {
            // let episodes = seasons[selectedIndex].episode
            season.episodes.push({ episodeName: episodeName, videoUrl: episodeVideoUrl })
        } else {
            season.episodes = [{ episodeName: episodeName, videoUrl: episodeVideoUrl }]
        }

        if (episodeName && episodeVideoUrl) {
            seasons[selectedIndex] = season
            // seasons.push(obj)
            firebase.firestore().collection("series").doc(id).update({
                seasons
            })
                .then((docRef) => {
                    this.setState({ episodeModal: false, seasons })
                    this.showAlert("success", "successfully added")
                    // console.log("Document written with ID: ", docRef.id);
                })
                .catch(function (error) {

                    console.error("Error adding document: ", error);
                });
        } else {
            this.setState({ episodeModal: false })
            this.showAlert("danger", "fil the form")
        }
    }

    render() {
        const { seasons, seasonModal, episodeModal } = this.state
        return (
            <Container fluid className="main-content-container px-4">
                <Alert className="mb-3" open={this.state.visible} theme={this.state.theme}>
                    {this.state.message}
                </Alert>
                <Modal open={seasonModal} toggle={() => this.setState({ seasonModal: !this.state.seasonModal, name: '', imageUrl: "" })}>
                    <ModalHeader>Add Season</ModalHeader>
                    <ModalBody>
                        <Form>
                            <FormGroup>
                                <label htmlFor="#text">Season Title</label>
                                <FormInput value={this.state.name} onChange={(e) => this.setState({ name: e.target.value })} id="#username" placeholder="season name" />
                            </FormGroup>
                            <FormGroup>
                                <label htmlFor="#url">Season display image</label>
                                <FormInput value={this.state.imageUrl} onChange={(e) => this.setState({ imageUrl: e.target.value })} placeholder="image url" />
                            </FormGroup>
                        </Form>

                        <Button onClick={() => this.seasonAdd()}>
                            Submit
                        </Button>
                    </ModalBody>
                </Modal>

                <Modal open={episodeModal} toggle={() => this.setState({ episodeModal: !this.state.episodeModal, name: '', imageUrl: "" })}>
                    <ModalHeader>Add Episode</ModalHeader>
                    <ModalBody>
                        <Form>
                            <FormGroup>
                                <label htmlFor="#text">Episode Title</label>
                                <FormInput value={this.state.episodeName} onChange={(e) => this.setState({ episodeName: e.target.value })} id="#username" placeholder="season name" />
                            </FormGroup>
                            <FormGroup>
                                <label htmlFor="#url">Episode video Url</label>
                                <FormInput value={this.state.episodeVideoUrl} onChange={(e) => this.setState({ episodeVideoUrl: e.target.value })} placeholder="video url" />
                            </FormGroup>
                        </Form>

                        <Button onClick={() => this.episodeAdd()}>
                            Submit
                        </Button>
                    </ModalBody>
                </Modal>

                <Row noGutters className="page-header py-4">
                    <PageTitle sm="4" title="ALL SEASONS" subtitle="Blog Posts" className="text-sm-left" />
                </Row>


                <Row>
                    {seasons.length > 0 ? seasons.map((post, idx) => (
                        <Col lg="12" sm="12" className="mb-4" key={idx}>
                            <Card small className="card-post card-post--aside card-post--1">
                                <div
                                    className="card-post__image"
                                    style={{ backgroundImage: `url('${post.seasonImage}')` }}
                                >
                                </div>
                                <CardBody>
                                    <h5 style={{ cursor: "pointer" }} className="card-title" onClick={() => this.setState({ selectedIndex: this.state.selectedIndex === idx ? -1 : idx })}>
                                        {/* <Link to={`/series/season/${post.id}`}> */}
                                        {post.seasonName}
                                        {/* </Link> */}
                                    </h5>

                                </CardBody>
                                <i onClick={() => this.setState({ seasonModal: true, name: post.seasonName, imageUrl: post.seasonImage, editing: true, editingId: idx, })} style={{
                                    position: "absolute",
                                    top: 10,
                                    right: 10,
                                    fontSize: 25,
                                    cursor: "pointer"
                                }} aria-setsize={100} class="material-icons">edit</i>
                            </Card>
                            <Collapse open={this.state.selectedIndex == idx} >
                                <div className="p-3 mt-3 border rounded">
                                    {post.episodes && post.episodes.map(val => <a href={val.videoUrl} target="_blank">{val.episodeName}</a>)}

                                </div>
                                    <Button onClick={() => this.setState({ episodeModal: true })}>Add Episode</Button>
                            </Collapse>
                        </Col>
                    )) : <p>No Data Available</p>}
                </Row>




                <Row>
                    <Button onClick={() => this.setState({ seasonModal: true })}>Add Season</Button>
                </Row>
            </Container>
        )
    }
}
