import { Injectable } from '@nestjs/common'
import { validationError, notFoundError } from '../common/api-errors'
import { EventType } from '../domain/models'
import { StoreService } from '../storage/store.service'

@Injectable()
export class EventTypesService {
  constructor(private readonly store: StoreService) {}

  list(): EventType[] {
    return this.store.listEventTypes()
  }

  getById(id: string): EventType {
    const eventType = this.store.getEventType(id)
    if (!eventType) {
      throw notFoundError('Event type not found', { eventTypeId: id })
    }
    return eventType
  }

  create(data: {
    title: string
    description?: string
    durationMinutes: number
  }): EventType {
    const title = data.title.trim()
    if (!title) {
      throw validationError('Title must not be empty', { field: 'title' })
    }

    return this.store.createEventType({
      title,
      description: data.description?.trim() || undefined,
      durationMinutes: data.durationMinutes,
    })
  }
}
