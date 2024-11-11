import React, { useState, useRef, useEffect } from 'react';
import { Send, Image, Smile, Paperclip, Trash } from 'lucide-react';
import { Card, CardContent } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';

const EphemeralChat = () => {
  const [messages, setMessages] = useState([]);
  const [inputText, setInputText] = useState('');
  const [showEmojiPicker, setShowEmojiPicker] = useState(false);
  const messagesEndRef = useRef(null);
  
  const emojis = ['😀', '😊', '😂', '❤️', '👍', '🎉', '🌟', '💡', '🔥', '✨'];

  const scrollToBottom = () => {
    messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
  };

  useEffect(() => {
    scrollToBottom();
  }, [messages]);

  const handleImageUpload = (e) => {
    const file = e.target.files[0];
    if (file) {
      const reader = new FileReader();
      reader.onloadend = () => {
        const newMessage = {
          type: 'image',
          content: reader.result,
          timestamp: new Date().toLocaleTimeString()
        };
        setMessages([...messages, newMessage]);
      };
      reader.readAsDataURL(file);
    }
  };

  const handleSendMessage = () => {
    if (inputText.trim()) {
      // Check if input is a URL
      const urlRegex = /(https?:\/\/[^\s]+)/g;
      const hasUrl = urlRegex.test(inputText);
      
      const newMessage = {
        type: hasUrl ? 'link' : 'text',
        content: inputText,
        timestamp: new Date().toLocaleTimeString()
      };
      
      setMessages([...messages, newMessage]);
      setInputText('');
    }
  };

  const handleEmojiClick = (emoji) => {
    setInputText(inputText + emoji);
    setShowEmojiPicker(false);
  };

  const handleKeyPress = (e) => {
    if (e.key === 'Enter' && !e.shiftKey) {
      e.preventDefault();
      handleSendMessage();
    }
  };

  const clearChat = () => {
    setMessages([]);
  };

  const renderMessage = (message) => {
    switch (message.type) {
      case 'text':
        return <p className="mb-1">{message.content}</p>;
      case 'image':
        return (
          <img 
            src={message.content} 
            alt="Uploaded content"
            className="max-w-xs rounded-lg"
          />
        );
      case 'link':
        return (
          <a 
            href={message.content}
            target="_blank"
            rel="noopener noreferrer"
            className="text-blue-500 hover:underline"
          >
            {message.content}
          </a>
        );
      default:
        return null;
    }
  };

  return (
    <Card className="w-full max-w-2xl mx-auto h-[600px] flex flex-col">
      <CardContent className="flex flex-col h-full p-4">
        {/* Chat header */}
        <div className="flex justify-between items-center mb-4">
          <h2 className="text-xl font-bold">Ephemeral Chat</h2>
          <Button 
            variant="ghost" 
            size="icon"
            onClick={clearChat}
          >
            <Trash className="h-5 w-5" />
          </Button>
        </div>

        {/* Messages area */}
        <div className="flex-1 overflow-y-auto mb-4 space-y-4">
          {messages.map((message, index) => (
            <div key={index} className="bg-gray-100 rounded-lg p-3">
              {renderMessage(message)}
              <span className="text-xs text-gray-500">{message.timestamp}</span>
            </div>
          ))}
          <div ref={messagesEndRef} />
        </div>

        {/* Emoji picker */}
        {showEmojiPicker && (
          <div className="absolute bottom-20 left-4 bg-white border rounded-lg p-2 shadow-lg">
            <div className="grid grid-cols-5 gap-2">
              {emojis.map((emoji, index) => (
                <button
                  key={index}
                  onClick={() => handleEmojiClick(emoji)}
                  className="text-xl hover:bg-gray-100 rounded p-1"
                >
                  {emoji}
                </button>
              ))}
            </div>
          </div>
        )}

        {/* Input area */}
        <div className="flex items-center gap-2">
          <Button
            variant="ghost"
            size="icon"
            onClick={() => setShowEmojiPicker(!showEmojiPicker)}
          >
            <Smile className="h-5 w-5" />
          </Button>
          
          <label className="cursor-pointer">
            <input
              type="file"
              accept="image/*"
              className="hidden"
              onChange={handleImageUpload}
            />
            <Button variant="ghost" size="icon" type="button">
              <Image className="h-5 w-5" />
            </Button>
          </label>

          <Input
            value={inputText}
            onChange={(e) => setInputText(e.target.value)}
            onKeyPress={handleKeyPress}
            placeholder="Type a message..."
            className="flex-1"
          />
          
          <Button onClick={handleSendMessage}>
            <Send className="h-5 w-5" />
          </Button>
        </div>
      </CardContent>
    </Card>
  );
};

export default EphemeralChat;
