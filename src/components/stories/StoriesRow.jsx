import "./StoriesRow.css";

function StoriesRow({
    stories,
    currentUserId,
    currentUser,
    onStoryClick,
    onYourStoryClick,
}) {
    const groupedStories = stories.reduce((acc, story) => {
        const userId = story.user._id;

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
        (g) => g.user._id === currentUserId
    );

    const otherStoryGroups = storyGroups.filter(
        (g) => g.user._id !== currentUserId
    );

    const hasUnseenStories = (group) => {
        if (group.user._id.toString() === currentUserId?.toString()) {
            return true;
        }

        return group.stories.some((story) =>
            !story.viewers.some((viewer) => {
                const viewerId =
                    typeof viewer === "string"
                        ? viewer
                        : viewer?._id;
                return viewerId?.toString() === currentUserId?.toString();
            })
        );
    };

    // STORY AVATAR
    function StoryAvatar({ user, hasUnseen, showPlus, onClick }) {
        return (
            <div className="story-item" onClick={onClick}>
                <div
                    className={`story-ring ${
                        hasUnseen ? "unseen" : "seen"
                    }`}
                >
                    <img
                        src={
                            user.profileImage?.url ||
                            "/default-avatar.png"
                        }
                        alt={user.username}
                        className="story-avatar"
                    />

                    {showPlus && (
                        <button
                            className="story-plus"
                            onClick={(e) => {
                                e.stopPropagation();
                                onYourStoryClick();
                            }}
                        >
                            +
                        </button>
                    )}
                </div>

                <small className="story-username">
                    {user.username}
                </small>
            </div>
        );
    }

    return (
        <div className="stories-row">
            {/* YOUR STORY */}
            {yourStoryGroup ? (
                <StoryAvatar
                    user={yourStoryGroup.user}
                    hasUnseen={hasUnseenStories(yourStoryGroup)}
                    showPlus
                    onClick={() => onStoryClick(yourStoryGroup)}
                />
            ) : (
                <StoryAvatar
                    user={{
                        username: "Your Story",
                        profileImage: currentUser.profileImage,
                    }}
                    hasUnseen={false}
                    showPlus
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