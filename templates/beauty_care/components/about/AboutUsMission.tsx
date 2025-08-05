import { AboutUsContent } from '@/lib/wordpress.d';
import React from 'react'

interface Props {
    aboutUsContent: AboutUsContent;
}

const AboutUsMission = ({aboutUsContent}: Props) => {
    return (
        <div className="text-center md:text-left">
             <h3 className="text-primary text-2xl mt-8 text-center font-bold md:text-left font-heading">
                {aboutUsContent.mission.title}
              </h3>
              <div
                className="prose max-w-none text-text prose-p:!mb-0 prose-p:!mt-0"
                dangerouslySetInnerHTML={{ __html: aboutUsContent.mission.content }}
              />
            </div>
    )
}

export default AboutUsMission
