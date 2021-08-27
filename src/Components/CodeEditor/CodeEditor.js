import React, { useState } from 'react';
import PropTypes from 'prop-types';
import styled from 'styled-components';

import 'codemirror/lib/codemirror.css';
import 'codemirror/theme/material.css';
import 'codemirror/mode/xml/xml';
import 'codemirror/mode/javascript/javascript';
import 'codemirror/mode/css/css';
import 'codemirror/addon/selection/active-line';
import 'codemirror/addon/scroll/simplescrollbars';
import 'codemirror/addon/scroll/simplescrollbars.css';

import { Controlled as ControlledEditor } from 'react-codemirror2';

const borderRadius = 8;

const Styled = {
    CodeEditor: styled.div`
        display: flex;
        flex-flow: column;
        padding: 10px;

        & header {
            background-color: rgb(20,21,28);
            border-top-left-radius: ${borderRadius}px;
            border-top-right-radius: ${borderRadius}px;
            padding: 3px 10px;
            overflow: hidden;
            min-height: fit-content;

            display: flex;
            align-items: center;
            user-select: none;
        }
        & h1 {
            margin: 0;
        }
        & img {
            height: 35px;
            width: auto;
            margin-right: 10px;
        }
        & .editor {
            border-bottom-left-radius: ${borderRadius}px;
            border-bottom-right-radius: ${borderRadius}px;
            width: 100%;
            height: 300px;
            overflow: hidden;
            
            display: flex;
        }
        & .editor::-webkit-scrollbar {
            width: 6px;
            margin-right: 20px;
            background-color: #F5F5F5;
        }
        & .editor::-webkit-scrollbar-thumb {
            border-radius: 4px;
            -webkit-box-shadow: inset 0 0 6px rgba(0,0,0,.3);
            background-color: rgb(60,63,84);
            border: 1px solid white;
        }
        & .cont-editor {
            width: 100%;
            height: 100%;
        }
        & .CodeMirror {
            width: 100%;
            height: 100%;
            font-size: ${(props) => `${props.fontSize}px`};
            font-family: ${(props) => `${props.font}`};
        }
        & .CodeMirror-lines {
            text-align: left;
        }
        & .CodeMirror-activeline-background {
            background: rgba(20,21,28, 0.1);
        }
        & .CodeMirror-overlayscroll-horizontal div,
        .CodeMirror-overlayscroll-vertical div {
            background: rgb(100,101,108);
        }
        & .CodeMirror-simplescroll-horizontal div,
        .CodeMirror-simplescroll-vertical div {
            background: rgb(100,101,108);
            border: 1px solid rgb(80,81,88);
        }
    `,
};

function CodeEditor({
    id, title, lang, code, logo, onTextChange, font, size,
}) {
    function handleTextChange(editor, data, value) {
        onTextChange(value, id);
    }

    return (
        <Styled.CodeEditor
            font={font}
            fontSize={size}
            id={`${lang}-editor`}
        >
            <header>
                <img src={logo} alt={`${title}-logo`} />
                <h1>{ title.toUpperCase() }</h1>
            </header>
            <div className="editor">
                <ControlledEditor
                    onBeforeChange={handleTextChange}
                    value={code}
                    className="cont-editor"
                    options={{
                        mode: lang,
                        lineWrapping: false,
                        lint: true,
                        lineNumbers: true,
                        tabSize: 4,
                        styleActiveLine: { nonEmpty: true },
                        scrollbarStyle: 'simple',
                    }}
                />
            </div>
        </Styled.CodeEditor>
    );
}

CodeEditor.propTypes = {
    id: PropTypes.number.isRequired,
    title: PropTypes.string.isRequired,
    lang: PropTypes.string.isRequired,
    code: PropTypes.string.isRequired,
    logo: PropTypes.element.isRequired,
    onTextChange: PropTypes.func.isRequired,

    font: PropTypes.string.isRequired,
    size: PropTypes.number.isRequired,
};

export default CodeEditor;
