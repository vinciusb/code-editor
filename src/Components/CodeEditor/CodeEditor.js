import React, { useState } from 'react';
import PropTypes from 'prop-types';
import styled from 'styled-components';
import utils from '../../Utils/utils';

const borderRadius = 8;
const taPadding = 5;

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
            font-size: ${(props) => `${props.fontSize}px`};
            border-bottom-left-radius: ${borderRadius}px;
            border-bottom-right-radius: ${borderRadius}px;
            width: 100%;
            height: 100%;
            box-sizing: border-box;
            overflow: scroll;
            
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
        & .line-indicator {
            background-color: red;
            height: fit-content;
            min-height: 100%;
            min-width: 1.6em;
            user-select: none;
            padding: ${taPadding}px 3px;
            box-sizing: border-box;
            
            display: flex;
            flex-flow: column;
            align-items: flex-end;
        }
        & .line-number {
            line-height: 1em;
        }
        & .text-editor {
            background-color: white;
            width: 100%;
            height: 100%;
            padding: ${taPadding}px 3px;
            box-sizing: border-box;
            user-select: text;
            cursor: text;
        }
        & .view-line {
            width: 100%;
            line-height: 1em;
            color: black;
            text-align: start;
        }
        & .view-line:focus {
            outline: none;
        }
    `,
};

function CodeEditor({
    id, lang, code, logo, onTextChange, font, size,
}) {
    const [linesNumbers, setLinesNumbers] = useState(10);

    function updateLineNumber(increase) {
        let newLines = linesNumbers;
        if(increase) {
            newLines += 1;
        }
        else if(linesNumbers > 1) {
            newLines -= 1;
        }
        setLinesNumbers(newLines);
    }

    function changeLinesCount(e, lastCode, currentCode) {
        const { inputType } = e.nativeEvent;
        // If increased the line number
        if(inputType === 'deleteContentBackward') {
            const dif = utils.getStringFirstDif(lastCode, currentCode);
            if(dif === '\n') updateLineNumber(false);
        }
        // If decreased the line number
        else if(inputType === 'insertLineBreak') {
            updateLineNumber(true);
        }
    }

    function handleTextChange(e) {
        onTextChange(e, id);
    }

    function renderLineNumbers() {
        const list = [];

        for(let i = 1; i <= linesNumbers; i++) {
            list.push(
                <div className="line-number">{ i }</div>,
            );
        }
        return list;
    }

    function renderTextLines(value) {
        const list = [];
        let i = 0;

        value.forEach((lineText) => {
            i += 1;
            list.push(
                <div
                    className="view-line"
                    key={i}
                    contentEditable="true"
                    onChange={null}
                >
                    {lineText}
                </div>,
            );
        });
        return list;
    }

    return (
        <Styled.CodeEditor
            font={font}
            fontSize={size}
            id={`${lang}-editor`}
        >
            <header>
                <img src={logo} alt="" />
                <h1>{ lang.toUpperCase() }</h1>
            </header>
            <div className="editor">
                <div className="line-indicator">
                    { renderLineNumbers() }
                </div>
                <div className="text-editor">
                    { renderTextLines(code) }
                </div>
            </div>
        </Styled.CodeEditor>
    );
}

/* TODO:- aplicar style pra palavras especiais
        - Quando exclui um conjunto de conteudo, fazer com que a numeração das
            linhas mudem tb, e.g. fzr com q a função de diferença de string
            pegue todas as diferenças e contar qnts \n tem dentro da diferença */

CodeEditor.propTypes = {
    id: PropTypes.number.isRequired,
    lang: PropTypes.string.isRequired,
    code: PropTypes.string.isRequired,
    logo: PropTypes.element.isRequired,
    onTextChange: PropTypes.func.isRequired,

    font: PropTypes.string.isRequired,
    size: PropTypes.number.isRequired,
};

export default CodeEditor;
