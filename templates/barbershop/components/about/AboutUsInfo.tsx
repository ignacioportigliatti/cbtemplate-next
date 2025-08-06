import { AboutUsContent } from '@/lib/wordpress.d';
import React from 'react'

interface Props {
    aboutUsContent: AboutUsContent;
}

const AboutUsInfo = ({aboutUsContent}: Props) => {
    return (
        <div className="scroll-animate">
           <span className="text-primary font-medium mb-2 text-2xl text-center md:text-left tracking-[0.2em] uppercase font-heading block scroll-animate">
              {aboutUsContent.page_info.subtitle}
            </span>
            <h1 className="text-4xl md:text-5xl font-heading text-text text-center md:text-left leading-[0.9] font-bold scroll-animate">
              {aboutUsContent.page_info.title}
            </h1>
            <div className="flex flex-col text-center md:text-left gap-4">
              <p className="text-text mb-4 w-full scroll-animate">{aboutUsContent.page_info.description}</p>
              <div className="flex flex-col scroll-animate">
                <h2 className="text-primary font-medium text-xl text-center md:text-left tracking-[0.2em] uppercase font-heading scroll-animate">
                  {aboutUsContent.story.title}
                </h2>
                <div
                  className="prose max-w-none text-text scroll-animate"
                  dangerouslySetInnerHTML={{ __html: aboutUsContent.story.content }}
                />
              </div>
            </div> 
        </div>
    )
}

export default AboutUsInfo
