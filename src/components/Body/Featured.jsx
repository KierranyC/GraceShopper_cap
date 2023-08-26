import React from "react";
import { Carousel } from "react-bootstrap/esm";

// This component is a slideshow of featured products. This could be directly tied to sales, ratings, customer view history, or even manually added to an arrary of featured products by an admin. Have not decided best approach yet.
export const Featured = () => {
  return (
    <div>
      <Carousel>
        <Carousel.Item>
          <Carousel.Caption>
            <h3>First slide label</h3>
            <p>Nulla vitae elit libero, a pharetra augue mollis interdum.</p>
          </Carousel.Caption>
        </Carousel.Item>

        <Carousel.Item>
          <Carousel.Caption>
            <h3>Second slide label</h3>
            <p>Lorem ipsum dolor sit amet, consectetur adipiscing elit.</p>
          </Carousel.Caption>
        </Carousel.Item>

        <Carousel.Item>
          <Carousel.Caption>
            <h3>Third slide label</h3>
            <p>
              Praesent commodo cursus magna, vel scelerisque nisl consectetur.
            </p>
          </Carousel.Caption>
        </Carousel.Item>
      </Carousel>
    </div>
  );
};
