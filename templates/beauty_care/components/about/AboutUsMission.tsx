import { AboutUsContent } from '@/lib/wordpress.d';
import React from 'react'

interface Props {
    aboutUsContent: AboutUsContent;
}

const AboutUsMission = ({aboutUsContent}: Props) => {
    return (
        <div className="text-center md:text-left">
              <h3 className="text-primary mt-8 font-medium text-xl text-center md:text-left tracking-[0.2em] uppercase font-heading">
                {aboutUsContent.mission.title}
              </h3>
              <div
                className="prose max-w-none text-text"
                dangerouslySetInnerHTML={{ __html: aboutUsContent.mission.content }}
              />
            </div>
    )
}

export default AboutUsMission
