"use client"
import React from 'react'
import { StoryblokComponent } from '@storyblok/react/rsc'
import { storyblokEditable } from '@storyblok/react'

const AboutPage = ({ blok }) => (
  <div {...storyblokEditable(blok)} className="about-page w-full max-w-[1400px] mx-auto">
    {blok.sections?.map(section => (
      <StoryblokComponent blok={section} key={section._uid} />
    ))}
  </div>
)

export default AboutPage 