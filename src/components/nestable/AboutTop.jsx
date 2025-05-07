"use client"
import React from 'react'
import { storyblokEditable } from '@storyblok/react'
import RichTextDefault from './RichText'

const AboutTop = ({ blok }) => (
  <section {...storyblokEditable(blok)} className="py-12 bg-gray-50">
    <div className="max-w-4xl mx-auto text-center">
      <h1 className="text-5xl font-semibold">{blok.title}</h1>
      {blok.body && (
        <div className="mt-6 prose prose-lg">
          <RichTextDefault blok={{ richtext: blok.body }} />
        </div>
      )}
    </div>
  </section>
)

export default AboutTop 