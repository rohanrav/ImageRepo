import React, { Component } from "react";
import Card from "react-bootstrap/Card";
import history from "../../history";

class ImageCard extends Component {
  constructor(props) {
    super(props);
    this.state = { spans: 0 };
    this.imageRef = React.createRef();
  }

  componentDidMount = () => {
    this.imageRef.current.addEventListener("load", this.setSpans);
  };

  setSpans = () => {
    const height = this.imageRef.current.clientHeight;
    const spans = Math.ceil(height / 10 + 1);
    this.setState({ spans });
  };

  render = () => {
    return (
      <Card className="img-card" style={{ gridRowEnd: `span ${this.state.spans}` }}>
        <Card.Img ref={this.imageRef} alt={this.props.description} src={this.props.src} />
        <Card.ImgOverlay
          onClick={() => history.push(this.props.href)}
          className="card-overlay"
          style={{
            height: `${this.imageRef.current?.clientHeight || 0}px`,
            width: `${this.imageRef.current?.clientWidth || 0}px`,
          }}
        >
          <Card.Title>{this.props.imageTitle}</Card.Title>
          <Card.Text>{`${this.props.imageDescription.substring(0, 50)}...`}</Card.Text>
          <Card.Text>{this.props.imageDate}</Card.Text>
        </Card.ImgOverlay>
      </Card>
    );
  };
}

ImageCard.defaultProps = {
  imageTitle: "Card Title",
  imageDescription: "Card Description",
  imageDate: "Card Date",
  href: "/home",
};

export default ImageCard;
