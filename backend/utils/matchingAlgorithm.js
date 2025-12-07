export const calculateMatchScore = (currentUser, targetUser) => {
    let score = 0;
    let matches = [];

    currentUser.skillsWanted.forEach(wantedSkill => {
        targetUser.skillsOffered.forEach(offeredSkill => {
            if (wantedSkill.skillName.toLowerCase() === offeredSkill.skillName.toLowerCase()) {
                score += 50;
                matches.push({
                    type: 'wanted-offered',
                    skill: wantedSkill.skillName,
                    category: offeredSkill.category
                });
            } else if (wantedSkill.category === offeredSkill.category) {
                score += 10;
            }
        });
    });

    currentUser.skillsOffered.forEach(offeredSkill => {
        targetUser.skillsWanted.forEach(wantedSkill => {
            if (offeredSkill.skillName.toLowerCase() === wantedSkill.skillName.toLowerCase()) {
                score += 50;
                matches.push({
                    type: 'offered-wanted',
                    skill: offeredSkill.skillName,
                    category: offeredSkill.category
                });
            }
        });
    });

    if (currentUser.location?.city === targetUser.location?.city) {
        score += 15;
    }

    if (currentUser.timezone === targetUser.timezone) {
        score += 10;
    }

    return { score, matches };
};