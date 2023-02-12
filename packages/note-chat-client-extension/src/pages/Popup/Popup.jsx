import React, { useState, useCallback } from 'react';
import axios from 'axios';
import { Button, Input, Row } from 'antd';
import 'antd/dist/reset.css';
import './Popup.css';

function sendMessageToContentScript(message, callback) {
  chrome.tabs.query({ active: true, currentWindow: true }, function (tabs) {
    chrome.tabs.sendMessage(tabs[0].id, message, function (response) {
      if (callback) callback(response);
    });
  });
}

const Popup = () => {
  const [input, setInput] = useState("");
  const [loadingSubmit, setLoadingSubmit] = useState(false);
  const [loadingLearn, setLoadingLearn] = useState(false);
  const [qa, setQa] = useState(null);

  const handleLearn = () => {
    setLoadingLearn(true);
    try {
      sendMessageToContentScript({
        type: 'ai:learn',
      }, (res) => {
        console.log(res);
        if (res && res.data) {
          axios.post('http://106.14.99.226/learn', res.data, {
            headers: {
              'Content-Type': 'application/json;charset=utf-8'
            }
          }).then(result => {
            console.log('learned!');
          }).finally(() => {
            setLoadingLearn(false);
            console.log('learn requested');
          });
        }
      });
    } catch (e) {
      throw new Error(e);
    }
  }

  const onChange = (e) => {
    setInput(e.target.value);
  };

  const onSubmit = (e) => {
    e.preventDefault();
    if (!input) return;
    setLoadingSubmit(true);
    try {
      console.log('input', input);
      axios.post('http://106.14.99.226/qa', {
        qa: input,
      }, {
        headers: {
          'Content-Type': 'application/json;charset=utf-8'
        }
      }).then(result => {
        console.log('result', result);
        setQa(result.data.content);
      }).finally(() => {
        console.log('qa requested');
        setLoadingSubmit(false);
      });
    } catch (e) {
      throw new Error(e);
    }
  };

  return (
    <div style={{ padding: 16 }}>
      <Row align="middle">
        <Button loading={loadingLearn} size="small" onClick={handleLearn}>Learn</Button>
      </Row>
      <Row style={{ marginTop: 16 }}>
        <p>question: </p>
      </Row>
      <Row>
        <Input.TextArea
          size="small"
          value={input}
          onChange={onChange}
        />
        <Button size="small" onClick={onSubmit} loading={loadingSubmit} type="primary">Ask</Button>
      </Row>
      {
        loadingSubmit && <p>get the answer...do not close the panel !</p>
      }
      <Row style={{ marginTop: 16, overflow: 'auto' }}>
        <p>answer: </p>
        <p>{qa && qa.answer}</p>
        <p>sources: </p>
        <p>{qa && qa.sources}</p>
      </Row>
    </div>
  );
};

export default Popup;
