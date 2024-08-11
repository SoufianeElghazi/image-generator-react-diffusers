import React, { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import axios from 'axios';
import { Row, Col, Card, Button } from 'react-bootstrap';

const ImageGallery = () => {
    const [images, setImages] = useState([]);
    const navigate = useNavigate();

    useEffect(() => {
        const fetchImages = async () => {
            try {
                const response = await axios.get('http://localhost:5000/get-images');
                setImages(response.data);
            } catch (error) {
                console.error("There was an error fetching the images!", error);
            }
        };

        fetchImages();
    }, []);

    const handleNavigateBack = () => {
        navigate('/');
    };

    return (
        <div className="coolbackground full-page">
            <div className="gallery-container container">
                <Button
                    variant="light"
                    className="position-absolute top-0 start-0 m-3"
                    onClick={handleNavigateBack}
                >
                    <i className="bi bi-arrow-left">Image Generator</i>
                </Button>

                <h2 className="text-center my-4 text-white">Gallery</h2>

                <Row>
                    {images.map((image, index) => (
                        <Col md={4} className="mb-4" key={index}>
                            <Card className="border" style={{ borderColor: '#6a0dad' }}>
                                <Card.Img variant="top" src={`data:image/png;base64,${image.data}`} />
                            </Card>
                        </Col>
                    ))}
                </Row>
            </div>
        </div>
    );
};

export default ImageGallery;
