"use client";

import React, { useState } from 'react';
import { DownOutlined, MenuOutlined } from '@ant-design/icons';
import { Dropdown, message, Space } from 'antd';

const onClick = ({ key }) => {
  message.info(`Click on item ${key}`);
};

const Navbar = () => {
  const [menuOpen, setMenuOpen] = useState(false); 

  const toggleMenu = () => {
    setMenuOpen(!menuOpen); 
  };

  const items = [
    {
      label: 'Tools',
      key: '',
      dropdownItems: [{ key: 'video', label: 'video transcoder' }],
    },
    {
      label: 'Documentation',
      key: '',
      dropdownItems: [{ key: 'images', label: 'coming soon' }],
    },
    {
      label: 'Help',
      key: '',
      dropdownItems: [{ key: 'pricing', label: 'coming soon' }],
    },
    // {
    //   label: 'Resources',
    //   key: 'resources',
    //   dropdownItems: [
    //     { key: 'resources', label: 'about' },
    //     { key: 'Graphic Design', label: 'documentation' },
    //   ],
    // },
  ];

  return (
    <div className='flex justify-between items-center pt-6'>
      <section className='flex space-x-4'>
        <p>V</p>
        <p>M</p>
      </section>
      <div className='md:hidden'>
        <MenuOutlined onClick={toggleMenu} className='cursor-pointer' /> 
      </div>
      <div className={`md:flex ${menuOpen ? 'block' : 'hidden'} absolute md:relative right-0 top-16 md:top-auto bg-white md:bg-transparent w-full md:w-auto z-50`}>
        <ul className='flex flex-col md:flex-row justify-center items-center space-y-4 md:space-y-0 md:space-x-8 p-4 md:p-0'>
          {items.map((item, index) => (
            <li key={index}>
              <Dropdown
                overlay={
                  <ul className='bg-white p-2 shadow-md'>
                    {item.dropdownItems.map((dropdownItem, dropdownIndex) => (
                      <li key={dropdownIndex} className='p-2'>
                        <a href={`/${dropdownItem.key}`} onClick={(e) => onClick(e, dropdownItem)}>
                          {dropdownItem.label}
                        </a>
                      </li>
                    ))}
                  </ul>
                }>
                <a onClick={(e) => e.preventDefault()} className='flex items-center'>
                  <Space>
                    <span>{item.label}</span>
                    <DownOutlined />
                  </Space>
                </a>
              </Dropdown>
            </li>
          ))}
          <li className='md:hidden'>
            <a href='#'>Login</a>
          </li>
          <li className='md:hidden'>
            <a href='#'>Signup</a>
          </li>
        </ul>
      </div>
      <section className='hidden md:flex space-x-4'>
        <div>
          <a href='#'>Login</a>
        </div>
        <div>
          <a href='#'>Signup</a>
        </div>
      </section>
    </div>
  );
};

export default Navbar;

