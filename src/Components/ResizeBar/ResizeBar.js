import React, { useState } from 'react';
import PropTypes from 'prop-types';
import styled from 'styled-components';

const Styled = {
    ResizeBar: styled.div`
        z-index: 3;
        background-color: ${(props) => `rgb(${props.color[0]}, ${props.color[1]}, ${props.color[2]})`};
        width: ${(props) => (props.isVertical ? `${props.size}px` : '100%')};
        height: ${(props) => (props.isVertical ? '100%' : `${props.size}px`)};
        cursor: ${(props) => (props.isVertical ? 'ew-resize' : 'ns-resize')};

        &:active {
            outline: ${(props) => ` 3px solid rgb(${props.color[0]}, ${props.color[1]}, ${props.color[2]}, 0.7)`};
        }
    `,
};

function ResizeBar({
    id, isVertical, size, color, onPropChange,
}) {
    // 0: Click, 1: Resize, 2: Stop
    const [resizeStage, setResizeStage] = useState(2);
    const [lastPosition, setLastPosition] = useState(0);

    function resize(e) {
        if(e.type === 'mousedown') {
            setResizeStage(0);
            setLastPosition(e.clientX);
            document.addEventListener('mouseup', resize);
        }
        else if(e.type === 'mouseup') {
            setResizeStage(2);
            document.removeEventListener('mouseup', resize);
        }
        else if(e.type === 'mousemove' && resizeStage < 2) {
            setResizeStage(1);
            const change = e.clientX - lastPosition;
            onPropChange(change, id);
        }
    }

    return (
        <Styled.ResizeBar
            isVertical={isVertical}
            size={size}
            color={color}
            onMouseDown={resize}
            onMouseUp={resize}
            onMouseMove={resize}
        />
    );
}

ResizeBar.defaultProps = {
    size: 10,
    color: [200, 0, 200],
};

ResizeBar.propTypes = {
    id: PropTypes.number.isRequired,
    isVertical: PropTypes.bool.isRequired,
    size: PropTypes.number,
    color: PropTypes.array,
    onPropChange: PropTypes.func.isRequired,
};

export default ResizeBar;
