// @flow

import React, { Component } from 'react';

import { isMobileBrowser } from '../../../base/environment/utils';
import { IconArrowDown } from '../../../base/icons';
import JitsiMeetJS from '../../../base/lib-jitsi-meet/_';
import { connect } from '../../../base/redux';
import { ToolboxButtonWithIcon } from '../../../base/toolbox/components';
import { getLocalJitsiVideoTrack } from '../../../base/tracks';
import { getMediaPermissionPromptVisibility } from '../../../overlay';
import { toggleVideoSettings, VideoSettingsPopup } from '../../../settings';
import { isVideoSettingsButtonDisabled } from '../../functions';
import VideoMuteButton from '../VideoMuteButton';
import VideoSelectorButton from '../VideoSelectorButton';

type Props = {

    /**
     * Click handler for the small icon. Opens video options.
     */
    onVideoOptionsClick: Function,

    /**
     * Whether the permission prompt is visible or not.
     * Useful for enabling the button on initial permission grant.
     */
    permissionPromptVisibility: boolean,

    /**
     * If the button should be disabled
     */
    isDisabled: boolean,

    /**
     * Flag controlling the visibility of the button.
     */
    visible: boolean,
};

type State = {

    /**
     * Whether the app has video permissions or not.
     */
    hasPermissions: boolean,
};

/**
 * Button used for video & video settings.
 *
 * @returns {ReactElement}
 */
class VideoSettingsButton extends Component<Props, State> {
    _isMounted: boolean;

    /**
     * Initializes a new {@code VideoSettingsButton} instance.
     *
     * @param {Object} props - The read-only properties with which the new
     * instance is to be initialized.
     */
    constructor(props) {
        super(props);

        this._isMounted = true;
        this.state = {
            hasPermissions: false
        };
    }

    /**
     * Updates device permissions.
     *
     * @returns {Promise<void>}
     */
    async _updatePermissions() {
        const hasPermissions = await JitsiMeetJS.mediaDevices.isDevicePermissionGranted(
            'video',
        );

        this._isMounted && this.setState({
            hasPermissions
        });
    }

    /**
     * Implements React's {@link Component#componentDidMount}.
     *
     * @inheritdoc
     */
    componentDidMount() {
        this._updatePermissions();
    }

    /**
     * Implements React's {@link Component#componentDidUpdate}.
     *
     * @inheritdoc
     */
    componentDidUpdate(prevProps) {
        if (this.props.permissionPromptVisibility !== prevProps.permissionPromptVisibility) {
            this._updatePermissions();
        }
    }

    /**
     * Implements React's {@link Component#componentWillUnmount}.
     *
     * @inheritdoc
     */
    componentWillUnmount() {
        this._isMounted = false;
    }

    /**
     * Implements React's {@link Component#render}.
     *
     * @inheritdoc
     */
    render() {
        const { isDisabled, onVideoOptionsClick, visible, split } = this.props;
        const iconDisabled = !this.state.hasPermissions || isDisabled;

        // return visible ? (
        //     <VideoSettingsPopup>
        //         <ToolboxButtonWithIcon
        //             icon = { IconArrowDown }
        //             iconDisabled = { iconDisabled }
        //             onIconClick = { onVideoOptionsClick }>
        //             <VideoMuteButton />
        //         </ToolboxButtonWithIcon>
        //     </VideoSettingsPopup>
        // ) : null;

        // Orig
        // return visible ? (
        return (
            <VideoSettingsPopup>
                {split ? (
                    <ToolboxButtonWithIcon
                        icon={IconArrowDown}
                        iconDisabled={iconDisabled}
                        onIconClick={onVideoOptionsClick}>
                        <VideoMuteButton/>
                    </ToolboxButtonWithIcon>
                ) : null}
                {split ? (
                    <ToolboxButtonWithIcon
                        icon={IconArrowDown}
                        iconDisabled={iconDisabled}
                        onIconClick={onVideoOptionsClick}>
                        <VideoSelectorButton
                            onClick={onVideoOptionsClick}/>
                    </ToolboxButtonWithIcon>
                ) : (
                    <ToolboxButtonWithIcon
                        icon={IconArrowDown}
                        iconDisabled={iconDisabled}
                        onIconClick={onVideoOptionsClick}>
                        <VideoMuteButton/>
                    </ToolboxButtonWithIcon>
                )}

            </VideoSettingsPopup>
        );
    }
}

/**
 * Function that maps parts of Redux state tree into component props.
 *
 * @param {Object} state - Redux state.
 * @returns {Object}
 */
function mapStateToProps(state) {
    return {
        hasVideoTrack: Boolean(getLocalJitsiVideoTrack(state)),
        isDisabled: isVideoSettingsButtonDisabled(state),
        permissionPromptVisibility: getMediaPermissionPromptVisibility(state),
        visible: !isMobileBrowser()
    };
}

const mapDispatchToProps = {
    onVideoOptionsClick: toggleVideoSettings
};

export default connect(
    mapStateToProps,
    mapDispatchToProps,
)(VideoSettingsButton);
