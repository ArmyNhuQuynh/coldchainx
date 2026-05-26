import React from 'react'

type Props = {
    children: React.ReactNode;
}

const FontProvider = ( { children }: Props ) =>
{
    return (
        <div className='font-inter'>
            { children }
        </div>
    )
}

export default FontProvider