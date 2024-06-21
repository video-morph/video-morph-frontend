"use client"

import React from 'react';
import { DownOutlined } from '@ant-design/icons';
import { Dropdown, message, Space } from 'antd';

const onClick = ({ key }) => {
  message.info(`Click on item ${key}`);
};

const Button = ({ open }) => {
  const items = [
    {
      label: 'Video',
      key: 'video',
      dropdownItems: [{ key: 'video', label: 'video transcoder' }],
    },
    {
      label: 'Image',
      key: 'image',
      dropdownItems: [{ key: 'images', label: 'coming soon' }],
    },
    {
      label: 'Pricing',
      key: 'pricing',
      dropdownItems: [{ key: 'pricing', label: 'coming soon' }],
    },
    {
      label: 'Resources',
      key: 'resources',
      dropdownItems: [
        { key: 'resources', label: 'about' },
        { key: 'Graphic Design', label: 'documentation' },
      ],
    },
  ];

  if (!open) return null;

  return (
    <div className='flex'>
      <ul className={`flex justify-center items-center space-x-8 ${open ? 'flex-col' : 'flex-row'}  `}>
        {items.map((item, index) => (
          <li key={index} className=''>
            <Dropdown
              overlay={
                <ul>
                  {item.dropdownItems.map((dropdownItem, dropdownIndex) => (
                    <li key={dropdownIndex}>
                      <a href={`/${dropdownItem.key}`} onClick={(e) => onClick(e, dropdownItem)}>
                        {dropdownItem.label}
                      </a>
                    </li>
                  ))}
                </ul>
              }>
              <a onClick={(e) => e.preventDefault()}>
                <Space>
                  <span>{item.label}</span>
                  <DownOutlined />
                </Space>
              </a>
            </Dropdown>
          </li>
        ))}
      </ul>
      
    </div>
  );
};

export default Button;
