import getEventsData from "api/EventsData";
import getUsersData from "api/UsersData";
import { deepEqual } from "lib/utils";
import { useQuery } from "react-query";
import useEventStore from "store/EventStore";
import useUsersStore from "store/UsersStore";

export function getEvents () {
    return useQuery({
        queryKey: ['events'],
        queryFn: getEventsData,
        refetchInterval: 300000,
        onSuccess: (data) => {
            // Obtener los eventos actuales del estado global
            const currentEvents = useEventStore.getState().getEvents();

            // Comparar los nuevos eventos con los actuales
            if (!deepEqual(data, currentEvents)) {
                // Actualizar el estado global solo si los datos han cambiado
                useEventStore.getState().setEvents(data);
            }
        }
    })
}

export function getUsers () {
    return useQuery({
        queryKey: ['users'],
        queryFn: getUsersData,
        refetchInterval: 300000,
        onSuccess: (data) => {
            // Obtener los usuarios actuales del estado global
            const currentUsers = useUsersStore.getState().getUsers();

            // Comparar los nuevos usuarios con los actuales
            if (!deepEqual(data, currentUsers)) {
                // Actualizar el estado global solo si los datos han cambiado
                useUsersStore.getState().setUsers(data);
            }
        }
    })
}