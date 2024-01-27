import React, { useState } from 'react';
import { Form, TextArea, Button, Message, Segment, Label, Icon, Input, Image, Grid } from 'semantic-ui-react';
import 'semantic-ui-css/semantic.min.css';

const PredictionForm = () => {
    const [textInput, setTextInput] = useState('');
    const [imageUrl, setImageUrl] = useState('');
    const [predictionResult, setPredictionResult] = useState(null);
    const [dogPredictionResult, setDogPredictionResult] = useState(null);
    const [loading, setLoading] = useState(false);
    const [error, setError] = useState(null);

    const handleInputChange = (e, { value }) => {
        setTextInput(value);
    };

    const handleSubmit = async () => {
        try {
            const response = await fetch('http://localhost:2808/news/predict', {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                },
                body: JSON.stringify({ text: textInput }),
            });

            if (response.ok) {
                const result = await response.json();
                setPredictionResult(result);
                setError(null);
            } else {
                const errorData = await response.json();
                setError(`Prediction failed: ${errorData.message}`);
                setPredictionResult(null);
            }
        } catch (error) {
            setError(`Error during prediction request: ${error.message}`);
            setPredictionResult(null);
        }
    };

    const handleSearch = async () => {
        setLoading(true);
        try {
            const response = await fetch('http://localhost:2808/dog/predict', {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                },
                body: JSON.stringify({ url: imageUrl }),
            });
            if (response.ok) {
                const result = await response.json();
                setDogPredictionResult(result);
                setError(null);
            } else {
                const errorData = await response.json();
                setError(`Prediction failed: ${errorData.message}`);
                setDogPredictionResult(null);
            }
            setImageUrl(imageUrl)
            setLoading(false)
            // this.setState({ result: JSON.stringify(result.data), image_url: url, loading: false, resultBack: true })
        } catch (error) {
            setError(`Error during prediction request: ${error.message}`);
            setDogPredictionResult(null);
        }
    };

    const renderResult = (result) => {
        console.log(result)
        return (
            <div>
                <b>Result:<br /></b>
                {result.result.map(
                    (res, ii) =>
                        <div key={res.label} style={{ marginBottom: 10 }}>
                            <Label
                                as="a"
                                href={`http://google.com/search?q=${res.label}`}
                                target="_blank"
                                color={ii === 0 ? 'green' : 'grey'}
                            >
                                {res.label}
                                <Label.Detail>{res.confidence.toFixed(2)}%</Label.Detail>
                            </Label>
                        </div>
                )}
            </div>
        )
    };

    return (
        <Grid centered>
            <Grid.Column style={{ width: '70%' }}>
                <Segment style={{ marginTop: '2rem' }}>
                    <Label color="orange" ribbon><Icon name="hashtag" />News classification</Label>
                    <br />
                    <Form>
                        <Form.Field
                            control={TextArea}
                            placeholder="Enter text..."
                            value={textInput}
                            onChange={handleInputChange}
                        />
                        <Button primary onClick={handleSubmit}>
                            Submit
                        </Button>
                    </Form>

                    {error && <Message negative>{error}</Message>}

                    {predictionResult && (
                        <Segment>
                            <h2>Result:</h2>
                            <p>{`Result: ${predictionResult.result}`}</p>
                            <p>{`Confidence: ${predictionResult.confidence}`}</p>
                        </Segment>
                    )}
                </Segment>

                {/* <Header as="h4" color="grey"><Icon name="hashtag" />Trending now</Header> */}
                <Segment style={{ marginTop: '2rem' }}>
                    <Label color="orange" ribbon><Icon name="search" />Fun - Which breed is my dog?</Label>
                    <Form>
                        <Input
                            action={{ icon: 'search', onClick: handleSearch, disabled: loading }}
                            value={imageUrl}
                            onChange={e => setImageUrl(e.target.value)}
                            placeholder='Enter URL...'
                            style={{ marginTop: 10 }}
                            disabled={loading}
                            fluid />
                    </Form>
                    {dogPredictionResult && (
                        <Segment>
                            <h2>Result:</h2>
                            <Image src={imageUrl} style={{ "max-width": "400px" }} />
                            {dogPredictionResult !== '' ? renderResult(dogPredictionResult) : null}
                        </Segment>
                    )}
                </Segment>
            </Grid.Column>
        </Grid>
    );
};

export default PredictionForm;
