import { useRouter } from 'next/router'
import React from 'react'

export default function Button(props) {
  const router = useRouter();
  const redirectTo = (path) => {
    router.push(path);
  }
  return (
    <button className='button-custom' onClick={() => redirectTo(props.redirectPath)}>{props.text}</button>
  )
}
