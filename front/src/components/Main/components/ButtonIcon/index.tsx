import React from 'react'
import { CustomIcon } from './style'

const ButtonIcon: React.FC<any> = (props: any) => {

    return (
        <CustomIcon {...props}>{props.children}</CustomIcon>
    )


}

export default ButtonIcon