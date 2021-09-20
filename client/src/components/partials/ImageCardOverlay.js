import React, { Component } from "react";
import Card from "react-bootstrap/Card";
import Spinner from "react-bootstrap/Spinner";
import history from "../../history";
import { CHILD_OVERLAY, PARENT_OVERLAY } from "../../actions/types";

class ImageCard extends Component {
  _isMounted = true;

  constructor(props) {
    super(props);
    this.state = { spans: 0 };
    this.imageRef = React.createRef();
  }

  componentDidMount = () => {
    this.imageRef.current.addEventListener("load", this.setSpans);
  };

  componentWillUnmount = () => {
    this._isMounted = false;
  };

  setSpans = () => {
    const height = this.imageRef?.current?.clientHeight || 100;
    const spans = Math.ceil(height / 10 + 1);
    this.props.onImageLoad(false);
    if (this._isMounted) {
      this.setState({ spans });
    }
  };

  overlayOnClick = (e) => {
    if (this.props.navigateOnClick) {
      return history.push(this.props.href);
    } else {
      return this.props.customOverlayOnClick(e);
    }
  };

  formatCaption = (caption) => {
    if (caption.length > 35) {
      return `${caption.slice(0, 35)}...`;
    }
    return caption;
  };

  render = () => {
    return (
      <>
        <Card className="img-card" style={{ gridRowEnd: `span ${this.state.spans}` }}>
          <Card.Img ref={this.imageRef} alt={this.props.description} src={this.props.src} />
          <Card.ImgOverlay
            id={PARENT_OVERLAY}
            onClick={this.overlayOnClick}
            className="card-overlay"
            style={{
              height: `${this.imageRef.current?.clientHeight || 0}px`,
              width: `${this.imageRef.current?.clientWidth || 0}px`,
            }}
            title={this.props.src}
          >
            {this.props.showCreditPrice && (
              <Card.Title id={CHILD_OVERLAY}>{this.props.imageTitle}</Card.Title>
            )}
            <Card.Text id={CHILD_OVERLAY}>
              {this.formatCaption(this.props.imageDescription)}
            </Card.Text>
            {this.props.showTimeText && (
              <Card.Text id={CHILD_OVERLAY}>{this.props.imageDate}</Card.Text>
            )}
          </Card.ImgOverlay>
        </Card>
      </>
    );
  };
}

ImageCard.defaultProps = {
  imageTitle: "Card Title",
  imageDescription: "Card Description",
  imageDate: "Card Date",
  href: "/home",
  navigateOnClick: true,
  showTimeText: true,
  showCreditPrice: true,
  onImageLoad: (loaderStatus) => console.log(`Loader: ${loaderStatus}`),
};

export default ImageCard;
