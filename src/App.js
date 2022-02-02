import React, { useState, useEffect } from 'react';
import { toast } from "react-toastify";
import { ToastContainer } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";
import Searchbar from "./Components/Searchbar";
import ImageGallery from "./Components/ImageGallery";
import Button from "./Components/Button";
import Loader from "./Components/Loader";
import Modal from "./Components/Modal";
import "./styles.css";
import { fetchImages } from "./Services/images-api";

const App = () => {
  const [query, setQuery] = useState('');
  const [data, setData] = useState([]);
  let [counter, setCounter] = useState(1);
  const [status, setStatus] = useState('idle');
  const [image, setImage] = useState(false);
  const [endOfList, setEndOfList] = useState(false);

  useEffect(() => {
    if (query === '') {
      return;
    }

    setStatus('pending');

    fetchImages(query, counter)
      .then(response => {
        setData(prevData => [...prevData, ...response]);

        if (counter !== 1) {
          window.scrollTo({
            top: document.documentElement.scrollHeight,
            behavior: 'smooth',
          });
        }
      })
      .catch(error => console.log(error.message))
      .finally(() => setStatus('resolved'));
  }, [counter, query]);

  const onHandleSubmit = event => {
    event.preventDefault();
    const inputValue = event.target.elements.input.value;
    const form = event.target;
    const notify = () => toast.error('Please enter a search query');

    if (inputValue) {
      setStatus('pending');
      setData([]);
      setImage(false);
      setQuery(inputValue);
      setEndOfList(false);
      setCounter((counter = 1));

      form.reset();
    } else {
      notify();
    }
  };

  const onImageClick = event => {
    if (event.target.nodeName === 'IMG') {
      setImage({
        src: event.target.src,
        large: event.target.sizes,
        tags: event.target.alt,
      });
    }
  };

  return (
    <>
      <Searchbar onSubmit={onHandleSubmit} />
      <ImageGallery data={data} onImageClick={onImageClick} />
      {status === 'pending' ? <Loader /> : null}
      {data.length > 0 ? (
        <Button
          data={data}
          onClick={() => setCounter(prev => prev + 1)}
          endOfList={endOfList}
          status={status}
        />
      ) : null}
       <ToastContainer />
      {data && <Modal image={image} />}
    </>
  );
};

export default App;
