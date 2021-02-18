// @flow

import { IconVideoSelector } from '../../base/icons';

import AbstractButton from '../../base/toolbox/components/AbstractButton';
import type { Props } from '../../base/toolbox/components/AbstractButton';

/**
 * An implementation of a button for selecting video source.
 */
export default class VideoSelectorButton<P : Props, S : *>
    extends AbstractButton<P, S> {

    icon = IconVideoSelector;
    toggledIcon = IconVideoSelector;

    /**
     * Handles clicking / pressing the button, and toggles the video mute state
     * accordingly.
     *
     * @protected
     * @returns {void}
     */
    _handleClick() {
        this.props.onClick();
    }

    /**
     * Indicates whether this button is in toggled state or not.
     *
     * @override
     * @protected
     * @returns {boolean}
     */
    _isToggled() {
        return true;
    }

    /**
     * Helper function to be implemented by subclasses, which must return a
     * {@code boolean} value indicating if video is muted or not.
     *
     * @protected
     * @returns {boolean}
     */
    _isVideoMuted() {
        // To be implemented by subclass.
    }

    /**
     * Helper function to perform the actual setting of the video mute / unmute
     * action.
     *
     * @param {boolean} videoMuted - Whether video should be muted or not.
     * @protected
     * @returns {void}
     */
    _setVideoMuted(videoMuted: boolean) { // eslint-disable-line no-unused-vars
        // To be implemented by subclass.
    }
}
