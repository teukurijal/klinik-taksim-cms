'use client'

import { useRef } from 'react'
import { Editor } from '@tinymce/tinymce-react'

// eslint-disable-next-line @typescript-eslint/no-explicit-any
type EditorRef = any

interface TinyMCEEditorProps {
  value: string
  onChange: (content: string) => void
  placeholder?: string
  height?: number
}

export default function TinyMCEEditor({ value, onChange, placeholder = 'Start writing...', height = 400 }: TinyMCEEditorProps) {
  const editorRef = useRef<EditorRef>(null)

  return (
    <Editor
      apiKey={process.env.NEXT_PUBLIC_TINYMCE_API_KEY}
      onInit={(_evt, editor) => editorRef.current = editor}
      value={value}
      onEditorChange={onChange}
      init={{
        height: height,
        menubar: false,
        plugins: [
          'advlist', 'autolink', 'lists', 'link', 'image', 'charmap', 'preview',
          'anchor', 'searchreplace', 'visualblocks', 'code', 'fullscreen',
          'insertdatetime', 'media', 'table', 'help', 'wordcount', 'emoticons'
        ],
        toolbar: [
          'undo redo | blocks fontsize | bold italic underline strikethrough | forecolor backcolor',
          'alignleft aligncenter alignright alignjustify | bullist numlist outdent indent',
          'link image media table | code preview fullscreen | help'
        ].join(' | '),
        content_style: `
          body { 
            font-family: -apple-system, BlinkMacSystemFont, 'Segoe UI', 'Roboto', 'Oxygen', 'Ubuntu', 'Cantarell', 'Fira Sans', 'Droid Sans', 'Helvetica Neue', sans-serif; 
            font-size: 14px;
            line-height: 1.6;
          }
        `,
        placeholder: placeholder,
        branding: false,
        resize: false,
        statusbar: false,
        skin: 'oxide',
        content_css: 'default',
        block_formats: 'Paragraph=p; Header 1=h1; Header 2=h2; Header 3=h3; Header 4=h4; Header 5=h5; Header 6=h6',
        setup: (editor) => {
          editor.on('init', () => {
            editor.getContainer().style.transition = "border-color 0.15s ease-in-out, box-shadow 0.15s ease-in-out"
          })
          
          editor.on('focus', () => {
            editor.getContainer().style.borderColor = '#3b82f6'
            editor.getContainer().style.boxShadow = '0 0 0 2px rgba(59, 130, 246, 0.1)'
          })
          
          editor.on('blur', () => {
            editor.getContainer().style.borderColor = '#d1d5db'
            editor.getContainer().style.boxShadow = 'none'
          })
        }
      }}
    />
  )
}