import { AboutUsContent } from '@/lib/wordpress.d';
import Image from 'next/image';
import React from 'react'

interface Props {
    aboutUsContent: AboutUsContent;
}

const AboutUsInfo = ({aboutUsContent}: Props) => {
    return (
        <div>
           <h2 className="text-primary font-medium text-3xl text-center md:text-left font-heading">
              {aboutUsContent.page_info.subtitle}
            </h2>
            <h1 className="text-4xl md:text-5xl font-heading text-text text-center md:text-left mb-2 font-bold">
              {aboutUsContent.page_info.title}
            </h1>
            <div className="flex flex-col text-center md:text-left gap-4">
              <p className="text-text mb-4 w-full">{aboutUsContent.page_info.description}</p>
              <div className="flex flex-col">
                <h5 className="text-primary text-2xl text-center font-bold md:text-left font-heading">
                  {aboutUsContent.story.title}
                </h5>
                <div
                  className="prose max-w-none text-text"
                  dangerouslySetInnerHTML={{ __html: aboutUsContent.story.content }}
                />
              </div>
            </div> 
        </div>
    )
}

export default AboutUsInfo
