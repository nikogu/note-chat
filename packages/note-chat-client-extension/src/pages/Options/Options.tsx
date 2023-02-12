import React, { useEffect, useState, useCallback, ReactElement, FC, useRef } from 'react';
import { Button, Input, Row, Col, message, Spin, Tag } from 'antd';
// import { LoadingOutlined } from '@ant-design/icons';
import styled from 'styled-components';
import axios from 'axios';

import './index.css';
import "./default.theme.scss";

// const apiPrefix = 'https://second-brain-1g2gwhaud0d1992d-1253325503.ap-shanghai.app.tcloudbase.com/container-qa-server2';
const apiPrefix = 'http://127.0.0.1:5000';

const Container = styled.div`
  background: #fff;
  margin: 0 auto;
  width: 400px;
  height: 100vh;
  overflow: auto;
  padding: 0 16px;
`;

const MessageLoadingWrapper = styled.div`
  position: absolute;
  top: 0px;
  right: 0px;
`;

const MessageBox = styled.div`
  position: relative;
  height: 500px;
  overflow: auto;
`;

type IMessage = {
  type: 'bot' | 'user',
  content: string | ReactElement;
  source?: string;
}

const requestQa = (text: string) => {
  return axios.post(`${apiPrefix}/qa`, {
    qa: text,
  }, {
    headers: {
      'Content-Type': 'application/json;charset=utf-8'
    }
  });
}

const Message: FC<IMessage> = ({ type, content, source }) => {
  const contentStyle = {
    background: type === 'bot' ? '#f6f8fa' : '#42d96c',
    borderRadius: '4px',
    display: 'inline-block',
    color: '#1e1e1e',
    lineHeight: '20px',
    wordBreak: 'break-all',
    fontSize: '13px',
    padding: '8px 16px',
    margin: '16px 0',
    marginLeft: type === 'bot' ? 0 : '48px',
    marginRight: type === 'user' ? 0 : '48px',
    maxWidth: 'calc(100% - 100px)',
  }

  const sourceStyle = {
    fontSize: 12,
    color: 'gray',
  }

  return <div style={{ display: 'flex', justifyContent: type === 'bot' ? 'flex-start' : 'flex-end' }}>
    <div style={contentStyle}>
      {content}
      {
        source && <div style={sourceStyle}>{source}</div>
      }
    </div>
  </div>;
}

const Options = () => {
  const boxRef = useRef() as React.MutableRefObject<HTMLInputElement>;;
  const [text, setText] = useState('');
  const [messages, setMessages] = useState<IMessage[]>([]);
  const [messageLoading, setMessageLoading] = useState(false);

  useEffect(() => {
    setMessages([...messages, {
      type: 'bot',
      content: 'Hello, I am your second brain assistant, you can ask me anything.',
    }]);
  }, [])

  useEffect(() => {
    if (boxRef.current) {
      console.log('boxRef.current', boxRef.current, boxRef.current.scrollTop, boxRef.current?.scrollHeight);
      boxRef.current.scrollTop = boxRef.current.scrollHeight || 999;
    }
  }, [messages]);

  const handleSend = useCallback(async () => {
    if (messageLoading) return;
    try {
      setMessageLoading(true);
      const newMessages: IMessage[] = [...messages, {
        type: 'user',
        content: text,
      }];
      setMessages(newMessages);
      setText('');
      const result = await requestQa(text);
      console.log('result', result);
      const data = result.data;
      if (data.success) {
        const content = data.content;
        setMessages([...newMessages, {
          type: 'bot',
          content: content.answer,
        }]);
      } else {
        message.error(data.message);
      }
    } catch (e: any) {
      message.error(e.message);
      console.error(e);
    } finally {
      setMessageLoading(false);
    }
  }, [text, messageLoading, setMessages]);

  const handleTextChange = (e: any) => {
    setText(e?.target?.value);
  };

  const handleEnter = (e: any) => {
    if (e.metaKey && e.key === 'Enter') {
      handleSend();
    }
  }

  return <Container>
    <MessageBox ref={boxRef}>
      {
        messages.map((msg, i) => <Message key={i} {...msg} />)
      }
    </MessageBox>
    <div style={{ position: 'relative' }}>
      {
        messageLoading && <MessageLoadingWrapper><Spin size="small" /></MessageLoadingWrapper>
      }
      <Tag style={{ marginBottom: 4 }}>`Command + Enter` can send message quickly :D</Tag>
      <Input.TextArea onKeyDown={handleEnter} value={text} rows={4} onChange={handleTextChange} />
      <Row justify="end">
        <Col>
          <Button loading={messageLoading} onClick={handleSend} style={{ marginTop: 8 }} type="primary">Send</Button>
        </Col>
      </Row>
    </div>
  </Container >
};

export default Options;
