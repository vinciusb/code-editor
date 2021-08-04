import React, { useState, useEffect } from 'react';
import PropTypes from 'prop-types';
import styled from 'styled-components';

import CodeEditor from '../CodeEditor/CodeEditor';

const Styled = {
    Editors: styled.div`
        background-color: red;

        display: grid;
        grid-template-columns: ${(props) => `${props.proportion[0]}fr ${props.proportion[1]}fr ${props.proportion[2]}fr`};
        justify-content: stretch;
    `,
};

function Editors({ transfer, onTransfer }) {
    const [sourceCodes, setSourceCodes] = useState(['', '', '']);
    const [editorsProportion, setEdProportion] = useState([1, 1, 1]);

    useEffect(() => {
        // Only when transfer is allowed
        if (transfer) {
            onTransfer(sourceCodes);
        }
    }, [transfer]);

    function changeSourceCode(code, id) {
        const newCode = sourceCodes.map((element, i) => (i === id ? code : element));
        setSourceCodes(newCode);
    }

    function renderCodeEditors() {
        const list = [];
        const infos = [
            { lang: 'html', logo: null, id: 0 },
            { lang: 'css', logo: null, id: 1 },
            { lang: 'js', logo: null, id: 2 },
        ];
        infos.forEach((obj) => {
            list.push(
                <CodeEditor
                    key={obj.id}
                    id={obj.id}
                    lang={obj.lang}
                    code={sourceCodes[obj.id]}
                    logo={obj.logo}
                    onTextChange={changeSourceCode}
                />,
            );
        });

        return list;
    }

    return (
        <Styled.Editors proportion={editorsProportion}>
            {renderCodeEditors()}
        </Styled.Editors>
    );
}

Editors.propTypes = {
    transfer: PropTypes.bool.isRequired,
    onTransfer: PropTypes.func.isRequired,
};

export default Editors;
