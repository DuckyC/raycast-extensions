import { Action, ActionPanel, Alert, confirmAlert, Icon, List } from "@raycast/api"
import { CityItem } from "../../types/CityItem"
import { countryList } from "../ressources/countryList"
import { DetailView } from "./DetailView"
import { useFavorites } from "./FavoritesProvider"

interface CityListItemViewProps extends CityItem {
    currentDate: Date
    isFavorite?: boolean
}

export const CityListItemView = ({
    geonameId,
    name,
    countryCode,
    timezone,
    coordinates,
    currentDate,
    isFavorite,
}: CityListItemViewProps) => {
    const city = { geonameId, name, countryCode, timezone, coordinates }

    const { addToFavorites, removeFromFavorites, moveFavorite } = useFavorites()

    return (
        <List.Item
            key={geonameId}
            icon={{ source: countryList[countryCode].flag }}
            title={name}
            detail={
                <DetailView
                    name={name}
                    countryCode={countryCode}
                    timezone={timezone}
                    coordinates={coordinates}
                    currentDate={currentDate}
                />
            }
            actions={
                <ActionPanel>
                    {isFavorite ? (
                        <>
                            <Action
                                title="Remove from Favorites"
                                style={Action.Style.Destructive}
                                icon={Icon.Trash}
                                onAction={async () => {
                                    if (
                                        await confirmAlert({
                                            title: "Remove from favorites?",
                                            message: `${countryList[countryCode].flag} ${name}`,
                                            primaryAction: { title: "Remove", style: Alert.ActionStyle.Destructive },
                                        })
                                    ) {
                                        await removeFromFavorites(city)
                                    }
                                }}
                            />
                            <Action
                                title="Move Favorite Up"
                                icon={Icon.ArrowUp}
                                shortcut={{ modifiers: ["cmd", "opt"], key: "arrowUp" }}
                                onAction={async () => await moveFavorite(city, "up")}
                            />
                            <Action
                                title="Move Favorite Down"
                                icon={Icon.ArrowDown}
                                shortcut={{ modifiers: ["cmd", "opt"], key: "arrowDown" }}
                                onAction={async () => await moveFavorite(city, "down")}
                            />
                        </>
                    ) : (
                        <Action
                            title="Add to Favorites"
                            icon={Icon.Star}
                            onAction={async () => await addToFavorites(city)}
                        />
                    )}
                </ActionPanel>
            }
        />
    )
}
