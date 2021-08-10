import React, { useState } from 'react';
import PropTypes from 'prop-types';
import styled from 'styled-components';

const borderSize = 8;

const Styled = {
    CodeEditor: styled.div`
        display: flex;
        flex-flow: column;
        padding: 10px;

        & header {
            background-color: rgb(20,21,28);
            border-top-left-radius: ${borderSize}px;
            border-top-right-radius: ${borderSize}px;
            padding: 3px 10px 0 10px;

            display: flex;
            align-items: center;
        }
        & h1 {
            margin: 0;
            user-select: none;
        }
        & img {
            height: 35px;
            width: auto;
            margin-right: 10px;
        }
        & .editor {
            font-size: ${(props) => `${props.fontSize}px`};
            border-bottom-left-radius: ${borderSize}px;
            border-bottom-right-radius: ${borderSize}px;
            width: 100%;
            height: 100%;
            overflow: hidden;

            display: flex;
        }
        & .line-indicator {
            height: 100%;
            background-color: red;
            min-width: 1.3em;
            user-select: none;
            padding-left: 1px;
            padding-right: 5px;

            display: flex;
            flex-flow: column;
            align-items: flex-end;
        }
        & .line-number {
            line-height: 1em;
        }
        & textarea{
            font-size: ${(props) => `${props.fontSize}px`};;
            font-family: monospace;
            font-weight: bolder;
            width: 100%;
            resize: none;
            padding: 2px 5px;
            border: none;
        }
        & textarea:focus {
            outline: none;
        }
    `,
};

function CodeEditor({
    id, lang, code, logo, onTextChange,
}) {
    const [linesNumbers, setLinesNumbers] = useState([1]);

    function changeLineNumber(increase) {
        const newLines = [...linesNumbers];
        if(increase) {
            const next = newLines[newLines.length - 1] + 1;
            newLines.push(next);
        }
        else {
            newLines.pop();
        }
        setLinesNumbers(newLines);
    }

    function handleTextChange(e) {
        onTextChange(e, id, code, changeLineNumber);
    }

    function renderLineNumbers() {
        const list = [];
        linesNumbers.forEach((line) => {
            list.push(<div className="line-number">{line}</div>);
        });
        return list;
    }

    /* TODO: - aplicar linhas sempre que tiver \n (como fazer isso? aplicar direto no texto?)
            - mudar style da scroll bar
            - aplicar style pra palavras especiais
            - Style do reload button
            - Há um jeito mais eficiente de descobrir a linha do editor? */
    return (
        <Styled.CodeEditor>
            <header>
                <img src={logo} alt="" />
                <h1>{ lang.toUpperCase() }</h1>
            </header>
            <div className="editor">
                <div className="line-indicator">
                    { renderLineNumbers() }
                </div>
                <textarea
                    id={`${lang}-editor`}
                    value={code}
                    onChange={handleTextChange}
                />
            </div>
        </Styled.CodeEditor>
    );
}

CodeEditor.propTypes = {
    id: PropTypes.number.isRequired,
    lang: PropTypes.string.isRequired,
    code: PropTypes.string.isRequired,
    logo: PropTypes.element.isRequired,
    onTextChange: PropTypes.func.isRequired,
};

export default CodeEditor;
