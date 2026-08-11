import "./StoriesRow.css";

const DEFAULT_AVATAR = "/default-avatar.svg";

const getAvatarUrl = (user) => {
    if (typeof user?.profileImage === "string" && user.profileImage.trim()) {
        return user.profileImage;
    }
    if (user?.profileImage?.url && typeof user.profileImage.url === "string") {
        return user.profileImage.url;
    }
    return DEFAULT_AVATAR;
};

function StoryAvatar({ user, hasUnseen, showPlus, onClick, onPlusClick }) {
    const avatarUrl = getAvatarUrl(user);

    return (
        <div className="story-item" onClick={onClick}>
            <div
                className={`story-ring ${
                    hasUnseen ? "unseen" : "seen"
                }`}
            >
                <img
                    src={avatarUrl}
                    alt={user?.username || "avatar"}
                    className="story-avatar"
                    onError={(e) => {
                        e.target.onerror = null;
                        e.target.src = DEFAULT_AVATAR;
                    }}
                />

                {showPlus && (
                    <button
                        className="story-plus"
                        onClick={(e) => {
                            e.stopPropagation();
                            onPlusClick?.();
                        }}
                    >
                        +
                    </button>
                )}
            </div>

            <small className="story-username">
                {user?.username}
            </small>
        </div>
    );
}

function StoriesRow({
    stories,
    currentUserId,
    currentUser,
    onStoryClick,
    onYourStoryClick,
}) {
    const groupedStories = (stories || []).reduce((acc, story) => {
        if (!story || !story.user || !story.user._id) return acc;
        const userId = story.user._id.toString();

        if (!acc[userId]) {
            acc[userId] = {
                user: story.user,
                stories: [],
            };
        }

        acc[userId].stories.push(story);
        return acc;
    }, {});

    const storyGroups = Object.values(groupedStories);

    const yourStoryGroup = storyGroups.find(
        (g) => g.user?._id?.toString() === currentUserId?.toString()
    );

    const otherStoryGroups = storyGroups.filter(
        (g) => g.user?._id?.toString() !== currentUserId?.toString()
    );

    const hasUnseenStories = (group) => {
        if (!group || !group.user || !group.stories) return false;
        if (group.user._id?.toString() === currentUserId?.toString()) {
            return false;
        }

        return group.stories.some((story) =>
            !story.viewers?.some((viewer) => {
                const viewerId =
                    typeof viewer === "string"
                        ? viewer
                        : viewer?._id;
                return viewerId?.toString() === currentUserId?.toString();
            })
        );
    };

    return (
        <div className="stories-row">
            {/* YOUR STORY */}
            {yourStoryGroup ? (
                <StoryAvatar
                    user={yourStoryGroup.user}
                    hasUnseen={hasUnseenStories(yourStoryGroup)}
                    showPlus
                    onPlusClick={onYourStoryClick}
                    onClick={() => onStoryClick(yourStoryGroup)}
                />
            ) : (
                <StoryAvatar
                    user={{
                        username: "Your Story",
                        profileImage: currentUser?.profileImage,
                    }}
                    hasUnseen={false}
                    showPlus
                    onPlusClick={onYourStoryClick}
                    onClick={onYourStoryClick}
                />
            )}

            {/* OTHER STORIES */}
            {otherStoryGroups.map((group) => (
                <StoryAvatar
                    key={group.user._id}
                    user={group.user}
                    hasUnseen={hasUnseenStories(group)}
                    onClick={() => onStoryClick(group)}
                />
            ))}
        </div>
    );
}

export default StoriesRow;