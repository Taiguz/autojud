import React from 'react'
import { CustomButton } from './style'

const Button: React.FC<any> = (props: any) => {
    return <CustomButton {...props}>{props.children}</CustomButton>
}

export default Button