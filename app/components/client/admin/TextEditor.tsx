'use client';

import { APP_URL } from '@/constants';
import { EditIcon } from 'lucide-react';
import dynamic from 'next/dynamic';
import { useState, useEffect } from 'react';

const Editor = dynamic(() => import('@tinymce/tinymce-react').then(m => m.Editor), {
      ssr: false,
});

const TextEditor = ({ value, onChange }: { value: string; onChange: (val: string) => void; }) => {

      const [mounted, setMounted] = useState(false);
      const [showEditor, setShowEditor] = useState(false);
      useEffect(() => setMounted(true), []);

      if (!mounted) return null;

      return (

            <div className="mt-2 w-full">

                  {
                        !showEditor &&
                        <div className='flex justify-end'>
                              <p className='underline flex cursor-pointer' onClick={() => !showEditor ? setShowEditor(true) : null}>
                                    Show Editor <EditIcon />
                              </p>
                        </div>
                  }

                  {
                        showEditor && <Editor
                              apiKey='z7xcyk2qcmtluw83si0as9zsfdyzcgok6344who8e1d921qn'
                              init={{
                                    plugins: [
                                          'anchor', 'autolink', 'charmap', 'codesample', 'emoticons', 'image', 'link', 'lists', 'media', 'searchreplace', 'table', 'visualblocks', 'wordcount',
                                    ],
                                    toolbar: 'undo redo | blocks fontfamily fontsize | bold italic underline strikethrough | link image media table mergetags | addcomment showcomments | spellcheckdialog a11ycheck typography | align lineheight | checklist numlist bullist indent outdent | emoticons charmap | removeformat',
                                    tinycomments_mode: 'embedded',
                                    content_css: [
                                          'https://cdn.jsdelivr.net/npm/bootstrap@5.3.3/dist/css/bootstrap.min.css',
                                          APP_URL + '/assets/css/desc-styles.css'
                                    ],
                              }}

                              value={value}
                              onEditorChange={onChange}
                        />
                  }

            </div>
      );
};

export default TextEditor;

