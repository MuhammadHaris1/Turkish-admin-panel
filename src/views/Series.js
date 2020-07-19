import React from 'react'
import { Container, Row, Col, Card, CardHeader, CardBody, Badge, Button, Modal, ModalBody, ModalHeader, Form, FormInput, FormGroup, Alert } from "shards-react";
import PageTitle from '../components/common/PageTitle';
import firebase from "../config/firebase"
import { Link } from 'react-router-dom';

export default class Series extends React.Component {
    constructor(props) {
        super(props)

        this.state = {
            PostsListTwo: [

            ],
            seriesModal: false,
            name: "",
            imageUrl: "",
            theme: '',
            visible: false,
            countdown: 0,
            timeUntilDismissed: 5,
            message: "",
            editing: false,
            editingId: ""
        }
    }

    componentDidMount() {
        const { PostsListTwo } = this.state
        firebase.firestore().collection("series").get().then((querySnapshot) => {
            // console.log(querySnapshot.docs)
            querySnapshot.forEach((doc) => {
                // console.log(dataObj)
                let dataObj = doc.data()
                dataObj.id = doc.id
                PostsListTwo.push(dataObj)
                this.setState({ PostsListTwo })
            });
        });

        // firebase.firestore().collection("series")
        //     .onSnapshot( (querySnapshot) => {
        //         querySnapshot.forEach((doc) => {
        //             // console.log(dataObj)
        //             let dataObj = doc.data()
        //             dataObj.id = doc.id
        //             PostsListTwo.push(dataObj)
        //             this.setState({ PostsListTwo })
        //         });
        //     });
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


    seriesAdd = () => {
        const { imageUrl, name, editing, editingId, PostsListTwo } = this.state
        if (editing) {
            let index = PostsListTwo.findIndex(x => x.id == editingId)
            if (imageUrl && name) {
                firebase.firestore().collection("series").doc(editingId).update({
                    titleOfSeries: name,
                    displayImage: imageUrl
                })
                    .then((docRef) => {
                        PostsListTwo[index].titleOfSeries = name
                        PostsListTwo[index].displayImage = imageUrl
                        this.setState({ seriesModal: false, editing: false, PostsListTwo })
                        this.showAlert("success", "successfully Updated")
                        // console.log("Document written with ID: ", docRef.id);
                    })
                    .catch(function (error) {

                        console.error("Error adding document: ", error);
                    });
            } else {
                this.setState({ seriesModal: false, editing: false })
                this.showAlert("danger", "fil the form")
            }
        } else {
            if (imageUrl && name) {
                firebase.firestore().collection("series").add({
                    titleOfSeries: name,
                    displayImage: imageUrl
                })
                    .then((docRef) => {
                        this.setState({ seriesModal: false })
                        this.showAlert("success", "successfully added")
                        // console.log("Document written with ID: ", docRef.id);
                    })
                    .catch(function (error) {

                        console.error("Error adding document: ", error);
                    });
            } else {
                this.setState({ seriesModal: false })
                this.showAlert("danger", "fil the form")
            }
        }
    }

    render() {
        const { PostsListTwo, seriesModal } = this.state
        // console.log(PostsListTwo)
        return (
            <Container fluid className="main-content-container px-4">
                <Alert className="mb-3" open={this.state.visible} theme={this.state.theme}>
                    {this.state.message}
                </Alert>
                <Modal open={seriesModal} toggle={() => this.setState({ seriesModal: !this.state.seriesModal, name: '', imageUrl: "" })}>
                    <ModalHeader>Add Series</ModalHeader>
                    <ModalBody>
                        <Form>
                            <FormGroup>
                                <label htmlFor="#text">Series Title</label>
                                <FormInput value={this.state.name} onChange={(e) => this.setState({ name: e.target.value })} id="#username" placeholder="series name" />
                            </FormGroup>
                            <FormGroup>
                                <label htmlFor="#url">Series display image</label>
                                <FormInput value={this.state.imageUrl} onChange={(e) => this.setState({ imageUrl: e.target.value })} placeholder="image url" />
                            </FormGroup>
                        </Form>

                        <Button onClick={() => this.seriesAdd()}>
                            Submit
                        </Button>
                    </ModalBody>
                </Modal>

                <Row noGutters className="page-header py-4">
                    <PageTitle sm="4" title="ALL SERIES" subtitle="Blog Posts" className="text-sm-left" />
                </Row>


                <Row>
                    {PostsListTwo.length > 0 ? PostsListTwo.map((post, idx) => (
                        <Col lg="12" sm="12" className="mb-4" key={idx}>
                            <Card small className="card-post card-post--aside card-post--1">
                                <div
                                    className="card-post__image"
                                    style={{ backgroundImage: `url('${post.displayImage}')` }}
                                >
                                </div>
                                <CardBody>
                                    <h5 className="card-title">
                                        <Link to={`/series/season/${post.id}`}>
                                            {post.titleOfSeries}
                                        </Link>
                                    </h5>

                                </CardBody>
                                <i onClick={() => this.setState({ seriesModal: true, name: post.titleOfSeries, imageUrl: post.displayImage, editing: true, editingId: post.id })} style={{
                                    position: "absolute",
                                    top: 10,
                                    right: 10,
                                    fontSize: 25,
                                    cursor: "pointer"
                                }} aria-setsize={100} class="material-icons">edit</i>
                            </Card>
                        </Col>
                    )) : <p>No Data Available</p>}
                </Row>

                <Row>
                    <Button onClick={() => this.setState({ seriesModal: true })}>Add Series</Button>
                </Row>
            </Container >
        )
    }
}
