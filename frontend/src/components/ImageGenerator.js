import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import axios from 'axios';
import { Button, Form,Spinner, Alert  } from 'react-bootstrap';

const ImageGenerator = () => {
    const [prompt, setPrompt] = useState("");
    const [image, setImage] = useState(null);
    const [loading, setLoading] = useState(false); 
    const [error, setError] = useState(null); 
    const navigate = useNavigate();

    const handleSubmit = async (e) => {
        e.preventDefault();
        setLoading(true);
        setError(null); 

        try {
            const response = await axios.post('http://localhost:5000/generate', { prompt }, { responseType: 'blob' });
            const imgUrl = URL.createObjectURL(response.data);
            setImage(imgUrl);

            const formData = new FormData();
            formData.append('image', response.data, `${prompt}.png`);

            await axios.post('http://localhost:5000/store-image', formData, {
                headers: {
                    'Content-Type': 'multipart/form-data'
                }
            });

        } catch (error) {
            console.error("There was an error generating the image!", error);
            setError("Failed to generate image. Please try again.");
        }finally {
            setLoading(false);
        }
    };

    const handleNavigate = () => {
        navigate('/gallery');
    };

    return (
        <div className="background full-page d-flex flex-column align-items-center justify-content-center">
            <Button
                variant="light"
                className="position-absolute top-0 start-0 m-3"
                onClick={handleNavigate}
            >
                Gallery
            </Button>

            <div className="text-center w-100" style={{ maxWidth: '600px' }}>
                <div
                    className="card border rounded p-3 mb-3"
                    style={{ height: '400px', borderColor: '#1e1b4b', display: 'flex', justifyContent: 'center', alignItems: 'center' }}
                >
                    {loading ? (
                        <div>
                            <Spinner animation="border" role="status">
                                <span className="visually-hidden">Generating...</span>
                            </Spinner>
                            <p>Generating...</p>
                        </div>
                    ) : image ? (
                        <img src={image} alt="Generated" className="img-fluid" />
                    ) : (
                        <p>Generated image will appear here.</p>
                    )}
                </div>
                {error && <Alert variant="danger">{error}</Alert>}

                <Form onSubmit={handleSubmit} className="d-flex">
                    <Form.Control
                        type="text"
                        placeholder="Describe your image..."
                        value={prompt}
                        onChange={(e) => setPrompt(e.target.value)}
                        className="card me-2"
                        style={{ borderColor: '#1e1b4b' }}
                    />
                    <Button type="submit" variant="light">
                        <i className="bi bi-arrow-up">Generate</i>
                    </Button>
                </Form>
            </div>
        </div>
    );
};

export default ImageGenerator;
