import { AboutUsContent } from '@/lib/wordpress.d';
import React from 'react'

interface Props {
    aboutUsContent: AboutUsContent;
}

const AboutUsMission = ({aboutUsContent}: Props) => {
    return (
        <div className="text-center md:text-left">
             <h5 className="text-primary text-2xl mt-8 text-center font-bold md:text-left font-heading">
                {aboutUsContent.mission.title}
              </h5>
              <div
                className="prose max-w-none text-text"
                dangerouslySetInnerHTML={{ __html: aboutUsContent.mission.content }}
              />
            </div>
    )
}

export default AboutUsMission
